import * as THREE from 'three';

// 툰 명암: 모든 Standard·Lambert 재질의 직사광 명암(dot(N, L))을 몇 단계로 끊는다 (2D 아이콘과 같은 그림체).
// 재질을 하나하나 바꾸지 않고 three.js 셰이더 조각(ShaderChunk)을 고친다 → 첫 재질이 그려지기 전에 한 번만 부른다.
// 반구광·주변광(그늘 쪽 은은한 색)은 그대로 두고 해가 비추는 쪽만 계단으로 만든다. 그림자도 그대로.
// 단계는 부드럽게 이어지도록 smoothstep 으로 경계를 살짝 흐린다.
const BAND = `
float toonBand( float d ) {
  float x = d * float( TOON_STEPS );
  float i = floor( x );
  float f = smoothstep( 0.5 - TOON_SOFT, 0.5 + TOON_SOFT, fract( x ) );
  return clamp( ( i + f ) / float( TOON_STEPS - 1 ) * TOON_TOP, 0.0, 1.0 );
}
`;

let installed = false;

export function installToonShading({ steps = 3, soft = 0.08, top = 1.0 } = {}) {
  if (installed) return;
  installed = true;
  const C = THREE.ShaderChunk;
  const head = `#define TOON_STEPS ${Math.max(2, steps)}\n#define TOON_SOFT ${soft.toFixed(3)}\n#define TOON_TOP ${top.toFixed(3)}\n${BAND}`;
  const swap = (name, from) => {
    if (!C[name].includes(from)) {
      console.warn(`[toon] ${name} 를 고치지 못했습니다 (three.js 버전이 바뀌었나요?)`);
      return;
    }
    C[name] = head + C[name].replace(from, 'float dotNL = toonBand( saturate( dot( geometryNormal, directLight.direction ) ) );');
  };
  swap('lights_physical_pars_fragment', 'float dotNL = saturate( dot( geometryNormal, directLight.direction ) );');
  swap('lights_lambert_pars_fragment', 'float dotNL = saturate( dot( geometryNormal, directLight.direction ) );');
}
