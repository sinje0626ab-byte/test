import * as THREE from 'three';

// 툰 외곽선: 2D 아이콘처럼 물체 둘레에 짙은 갈색 선 (#2e2118).
// 1) 장면을 그림판(렌더 타깃, MSAA)에 그린다 — 색 + 깊이
// 2) 같은 장면을 '물체 번호 색'으로 한 번 더 그린다 (scene.overrideMaterial, 그림자·하늘 없이)
//    각 메시는 Object3D.id 를 색으로 바꿔 칠한다. 땅·풀·꽃(userData.outline === false)은 0번
//    비치는 것(입자·체력바·이름표·스프라이트, 투명도 < 0.98 또는 더하기 섞기)은 이 그림에서 빼서 선이 생기지 않게 한다
// 3) 이웃 픽셀과 번호가 다르고 내가 더 가까우면(깊이) 그 자리에 선. 멀어질수록 옅게(fadeStart~fadeEnd m)
// 위에서 내려다보는 카메라라 깊이만으로는 땅 위 물체 옆면 윤곽이 잡히지 않아서 번호 그림을 쓴다.
const VERT = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const FRAG = `
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform sampler2D tId;
uniform vec2 texel;
uniform float cameraNear;
uniform float cameraFar;
uniform vec3 lineColor;
uniform float strength;
uniform float thickness;
uniform vec2 fade;
varying vec2 vUv;

float viewZ( vec2 uv ) {
  float z = texture2D( tDepth, uv ).x * 2.0 - 1.0;
  return ( 2.0 * cameraNear * cameraFar ) / ( cameraFar + cameraNear - z * ( cameraFar - cameraNear ) );
}
// 이웃이 다른 물체이고, 나(c)가 더 가깝거나 비슷하면 1
float side( vec3 id, float c, vec2 uv ) {
  vec3 o = texture2D( tId, uv ).rgb;
  if ( distance( o, id ) < 0.002 ) return 0.0;
  return step( c, viewZ( uv ) + 0.05 );
}

void main() {
  vec4 col = texture2D( tColor, vUv );
  vec3 id = texture2D( tId, vUv ).rgb;
  float c = viewZ( vUv );
  vec2 o = texel * thickness;
  float edge = 0.0;
  if ( dot( id, id ) > 0.0 ) {
    edge = max( max( side( id, c, vUv + vec2( o.x, 0.0 ) ), side( id, c, vUv - vec2( o.x, 0.0 ) ) ),
                max( side( id, c, vUv + vec2( 0.0, o.y ) ), side( id, c, vUv - vec2( 0.0, o.y ) ) ) );
  }
  edge *= 1.0 - smoothstep( fade.x, fade.y, c );
  col.rgb = mix( col.rgb, lineColor, edge * strength );
  gl_FragColor = col;
  #include <colorspace_fragment>
}
`;
// 번호 그림 재질: 인스턴싱·스키닝(나중의 GLB 캐릭터)도 그대로 따라 그린다
const ID_VERT = `
#include <common>
#include <skinning_pars_vertex>
void main() {
  #include <skinbase_vertex>
  #include <begin_vertex>
  #include <skinning_vertex>
  #include <project_vertex>
}
`;
const ID_FRAG = `
uniform vec3 idColor;
uniform float skip;
void main() {
  if ( skip > 0.5 ) discard;
  gl_FragColor = vec4( idColor, 1.0 );
}
`;

let idPass = null; // 번호 그림을 그리는 동안만 (재질)
const tmp = new THREE.Color();

// 모든 물체 공통: 번호 그림 중이면 이 물체의 번호 색을 재질에 넣는다
THREE.Object3D.prototype.onBeforeRender = function (renderer, scene, camera, geometry, material) {
  if (!idPass || material !== idPass) return;
  const own = this.material && (Array.isArray(this.material) ? this.material[0] : this.material);
  // 실제로 비치는 것만 뺀다 (몬스터 재질은 사라짐 연출 때문에 transparent 이지만 평소엔 불투명)
  const hide = this.isSprite || this.isPoints || this.isLine || (own && (own.depthTest === false || (own.transparent && (own.opacity < 0.98 || own.blending !== THREE.NormalBlending))));
  material.uniforms.skip.value = hide ? 1 : 0;
  if (!hide) {
    const n = this.userData.outline === false ? 0 : this.id;
    // 번호를 흩어진 색으로 (가까운 번호도 색이 크게 다르게)
    tmp.setRGB(((n * 73) % 251) / 251 + 0.002, ((n * 151) % 241) / 241 + 0.002, ((n * 199) % 239) / 239 + 0.002);
    if (!n) tmp.setRGB(0, 0, 0);
    material.uniforms.idColor.value.copy(tmp);
  }
  material.uniformsNeedUpdate = true;
};

export class OutlinePass {
  constructor(renderer, cfg) {
    this.renderer = renderer;
    this.cfg = cfg;
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    this.target = new THREE.WebGLRenderTarget(size.x, size.y, {
      samples: cfg.samples ?? 4,
      type: THREE.HalfFloatType,
      depthTexture: new THREE.DepthTexture(size.x, size.y),
    });
    this.target.depthTexture.format = THREE.DepthFormat;
    this.target.depthTexture.type = THREE.UnsignedIntType;
    this.idTarget = new THREE.WebGLRenderTarget(size.x, size.y, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: true });
    this.idMaterial = new THREE.ShaderMaterial({
      vertexShader: ID_VERT,
      fragmentShader: ID_FRAG,
      uniforms: { idColor: { value: new THREE.Color() }, skip: { value: 0 } },
      side: THREE.DoubleSide,
    });
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        tColor: { value: this.target.texture },
        tDepth: { value: this.target.depthTexture },
        tId: { value: this.idTarget.texture },
        texel: { value: new THREE.Vector2(1 / size.x, 1 / size.y) },
        cameraNear: { value: 0.1 },
        cameraFar: { value: 1000 },
        lineColor: { value: new THREE.Color(cfg.color) },
        strength: { value: cfg.strength },
        thickness: { value: cfg.thickness },
        fade: { value: new THREE.Vector2(cfg.fadeStart, cfg.fadeEnd) },
      },
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.quad.frustumCulled = false;
    this.scene = new THREE.Scene();
    this.scene.add(this.quad);
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.black = new THREE.Color(0, 0, 0);
    this.setSize();
  }

  setSize() {
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    this.target.setSize(size.x, size.y);
    this.idTarget.setSize(size.x, size.y);
    this.material.uniforms.texel.value.set(1 / size.x, 1 / size.y);
    // 고해상도 화면은 선을 조금 굵게 → 보이는 굵기를 비슷하게
    this.material.uniforms.thickness.value = this.cfg.thickness * Math.max(1, this.renderer.getPixelRatio() * 0.75);
  }

  render(scene, camera) {
    const r = this.renderer;
    const u = this.material.uniforms;
    u.cameraNear.value = camera.near;
    u.cameraFar.value = camera.far;
    r.setRenderTarget(this.target);
    r.render(scene, camera);
    // 번호 그림: 그림자 다시 굽지 않고, 하늘 없이 검은 바탕
    const bg = scene.background;
    const fog = scene.fog;
    const auto = r.shadowMap.autoUpdate;
    const clear = r.getClearColor(new THREE.Color());
    const alpha = r.getClearAlpha();
    scene.background = null;
    scene.fog = null;
    scene.overrideMaterial = this.idMaterial;
    r.shadowMap.autoUpdate = false;
    r.setClearColor(this.black, 1);
    idPass = this.idMaterial;
    r.setRenderTarget(this.idTarget);
    r.render(scene, camera);
    idPass = null;
    scene.overrideMaterial = null;
    scene.background = bg;
    scene.fog = fog;
    r.shadowMap.autoUpdate = auto;
    r.setClearColor(clear, alpha);
    r.setRenderTarget(null);
    r.render(this.scene, this.camera);
  }
}
