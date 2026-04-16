import { useRef, useState, useCallback, useEffect } from 'react'
import { useAnimations } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================
// useAnimationPlayer - 封装 drei useAnimations 的动画播放 Hook
// ============================================================

/** Hook 返回结果 */
export interface UseAnimationPlayerResult {
  /** 可用动画列表 */
  animations: THREE.AnimationClip[]
  /** 当前播放的动画名称 */
  currentAnimation: string | null
  /** 是否正在播放 */
  isPlaying: boolean
  /** 播放速度 */
  speed: number
  /** 播放指定动画（无参数则播放当前动画） */
  play: (name?: string) => void
  /** 暂停当前动画 */
  pause: () => void
  /** 停止当前动画 */
  stop: () => void
  /** 设置播放速度（0.5 ~ 2.0） */
  setSpeed: (speed: number) => void
  /** 设置是否循环播放 */
  setLoop: (loop: boolean) => void
}

/**
 * 动画播放控制 Hook
 * - 封装 drei 的 useAnimations
 * - 使用 ref 追踪高频状态（speed、isPlaying 等），避免不必要的 re-render
 * - 仅 currentAnimation 使用 useState，用于 UI 显示
 *
 * @param clips 动画片段数组
 * @param groupRef 模型 Group 的 ref
 */
export function useAnimationPlayer(
  clips: THREE.AnimationClip[],
  groupRef: React.RefObject<THREE.Group | null>
): UseAnimationPlayerResult {
  // 使用 drei 的 useAnimations 管理动画
  const { actions, mixer } = useAnimations(clips, groupRef)

  // 用 useState 追踪需要触发 re-render 的状态（UI 显示用）
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null)
  const [isPlayingState, setIsPlayingState] = useState(false)
  const [speedState, setSpeedState] = useState(1)

  // 用 ref 追踪高频状态，避免在回调中触发不必要的渲染
  const currentAnimRef = useRef<string | null>(null)
  const isPlayingRef = useRef(false)
  const speedRef = useRef(1)
  const loopRef = useRef(true)

  // 播放指定动画
  const play = useCallback(
    (name?: string) => {
      const animName = name ?? currentAnimRef.current
      if (!animName) {
        // 如果没有指定名称且没有当前动画，尝试播放第一个
        if (clips.length > 0) {
          const firstName = clips[0].name
          const action = actions[firstName]
          if (action) {
            action.reset()
            action.timeScale = speedRef.current
            action.setLoop(
              loopRef.current ? THREE.LoopRepeat : THREE.LoopOnce,
              loopRef.current ? Infinity : 1
            )
            action.clampWhenFinished = !loopRef.current
            action.play()
            currentAnimRef.current = firstName
            isPlayingRef.current = true
            setCurrentAnimation(firstName)
            setIsPlayingState(true)
          }
        }
        return
      }

      const action = actions[animName]
      if (!action) return

      // 停止当前正在播放的其他动画
      if (currentAnimRef.current && currentAnimRef.current !== animName) {
        const prevAction = actions[currentAnimRef.current]
        prevAction?.fadeOut(0.3)
      }

      action.reset()
      action.fadeIn(0.3)
      action.timeScale = speedRef.current
      action.setLoop(
        loopRef.current ? THREE.LoopRepeat : THREE.LoopOnce,
        loopRef.current ? Infinity : 1
      )
      action.clampWhenFinished = !loopRef.current
      action.play()

      currentAnimRef.current = animName
      isPlayingRef.current = true
      setCurrentAnimation(animName)
      setIsPlayingState(true)
    },
    [actions, clips]
  )

  // 暂停当前动画
  const pause = useCallback(() => {
    if (!currentAnimRef.current) return
    const action = actions[currentAnimRef.current]
    if (action) {
      action.paused = true
      isPlayingRef.current = false
      setIsPlayingState(false)
    }
  }, [actions])

  // 停止当前动画
  const stop = useCallback(() => {
    if (!currentAnimRef.current) return
    const action = actions[currentAnimRef.current]
    if (action) {
      action.stop()
      isPlayingRef.current = false
      setIsPlayingState(false)
      setCurrentAnimation(null)
      currentAnimRef.current = null
    }
  }, [actions])

  // 设置播放速度（限制在 0.5 ~ 2.0）
  const setSpeed = useCallback(
    (newSpeed: number) => {
      const clampedSpeed = Math.max(0.5, Math.min(2.0, newSpeed))
      speedRef.current = clampedSpeed
      setSpeedState(clampedSpeed)

      // 实时更新当前播放动画的速度
      if (currentAnimRef.current) {
        const action = actions[currentAnimRef.current]
        if (action) {
          action.timeScale = clampedSpeed
        }
      }
    },
    [actions]
  )

  // 设置循环模式
  const setLoop = useCallback(
    (loop: boolean) => {
      loopRef.current = loop

      // 实时更新当前播放动画的循环模式
      if (currentAnimRef.current) {
        const action = actions[currentAnimRef.current]
        if (action) {
          action.setLoop(
            loop ? THREE.LoopRepeat : THREE.LoopOnce,
            loop ? Infinity : 1
          )
          action.clampWhenFinished = !loop
        }
      }
    },
    [actions]
  )

  // 监听动画完成事件（LoopOnce 模式下自动更新状态）
  useEffect(() => {
    const handleFinished = (_e: { action: THREE.AnimationAction }) => {
      if (!loopRef.current) {
        isPlayingRef.current = false
        setIsPlayingState(false)
      }
    }

    mixer.addEventListener('finished', handleFinished as any)
    return () => {
      mixer.removeEventListener('finished', handleFinished as any)
    }
  }, [mixer])

  return {
    animations: clips,
    currentAnimation,
    isPlaying: isPlayingState,
    speed: speedState,
    play,
    pause,
    stop,
    setSpeed,
    setLoop,
  }
}
