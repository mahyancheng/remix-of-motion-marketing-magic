import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // 1. 初始化为 undefined 以避免 SSR 环境下的 Hydration Mismatch
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // 创建媒体查询监听器
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // 🚀 性能优化：直接使用 MediaQueryListEvent 的 matches 属性
    // 这样不需要浏览器去重新计算窗口宽度，性能更好
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }

    // 现代浏览器使用 addEventListener
    mql.addEventListener("change", onChange)
    
    // 初始化状态
    setIsMobile(mql.matches)

    // 清理函数：防止内存泄漏 (这是预防 Error 5 的关键)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // 2. 只有当明确检测到是移动端时才返回 true，默认返回 false
  return !!isMobile
}