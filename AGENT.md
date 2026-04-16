# AGENT.md - 项目开发约束（React Three Fiber 3D 项目）
本文件用于约束 AI 助手、开发者在本项目中的代码风格、性能规则、Three.js 最佳实践。

## 一、禁止行为（严禁违反）
- 禁止在 useFrame、循环、onPointerMove、onPointerHover 等高频事件中使用 setState。
- 禁止频繁创建、销毁 THREE 对象（Vector3、Color、Matrix 等），应复用实例。
- 禁止不使用 useMemo 包裹几何体、材质、模型加载逻辑。
- 禁止直接修改纹理尺寸，如需更换尺寸必须创建新纹理并 dispose 旧纹理。
- 禁止滥用 <group> 当作性能优化手段，group 不减少 DrawCall。
- 禁止未使用 useGLTF/useTexture 等缓存 API 加载资源。
- 禁止组件卸载时不清理几何体、材质、纹理（必须 .dispose()）。
- 禁止在渲染循环中修改 ref 以外的响应式状态。
- 禁止使用已废弃的 Geometry API，必须全部使用 BufferGeometry。
- 禁止未优化的大模型直接上线，必须使用 Draco 压缩。

## 二、性能优化强制规则
- 批量渲染重复物体时，必须使用 @react-three/drei 的 <Instances> 组件封装，通过 <Instance> 声明式定义矩阵信息，严禁使用循环创建独立 mesh，严禁手动实例化 THREE.BoxGeometry、THREE.SphereGeometry 等原生几何体。
```tsx
// 示例
<instancedMesh >
    <boxGeometry />
    <meshStandardMaterial />
</instancedMesh>
```
- 静态物体可合并时使用 mergeGeometries 减少 DrawCall。
- 模型必须使用 GLTF/GLB + Draco 压缩。
- 相机视野外物体应做视锥体剔除或显隐控制。
- 后处理（Outline、Highlight）不可同时开启过多。
- 动态效果优先使用 Shader 或 uniforms，禁止频繁切换材质。

## 三、React 交互规则
- 高频更新（位置、旋转、缩放）必须使用 ref，禁止 useState。
- 鼠标/触摸交互只在必要时触发状态更新。
- 3D 场景组件应使用 memo 防止不必要重渲染。
- useState/useReducer 仅用于低频状态（选中、开关、模式）。

## 四、材质与纹理规则
- 禁止动态修改原有纹理尺寸，必须新建纹理替换。
- 透明材质必须正确配置 transparent、depthWrite、depthTest。
- 材质、几何体必须在组件卸载时 dispose 释放内存。
- 尽量复用材质，禁止为每个物体创建独立材质。

## 五、Shader 使用规范
- 简单描边、高亮优先使用 drei <Outline> / <Highlight>。
- 复杂效果（温度渐变、扫描线、波纹、边缘发光）才使用自定义 Shader。
- Shader 内禁止使用循环、高耗计算。
- 动态参数必须通过 uniforms 传入，禁止修改 Shader 字符串。

## 六、文件与架构规范
- 3D 场景拆分组件：场景、相机、光照、模型、控制、UI。
- 禁止将大量逻辑写在单一 Canvas 内。
- 工具函数、常量、配置单独抽离。
- 模型、材质、动画逻辑必须使用 useMemo 缓存。

## 七、术语与库使用规范
- 使用 @react-three/fiber 作为核心渲染器。
- 使用 @react-three/drei 提供控制器、加载器、高亮、实例化。
- 使用 @react-three/postprocessing 提供后处理。
- 禁止手写原生 WebGL / 裸 Three.js 模板代码，除非必要。