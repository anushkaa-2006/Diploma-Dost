import { useEffect, useRef } from 'react'

export default function SpaceMesh() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let frameId
    let w, h, points
    let isMobile = false

    function resize() {
      w = canvas.width  = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
      isMobile = w < 768
      initPoints()
    }

    function initPoints() {
      // Mobile: 50 points (was 120). Triangle loop is O(n³) —
      // 120³ ≈ 1.7M ops/frame vs 50³ ≈ 125K. On mobile we skip
      // triangles entirely and only draw edges + dots.
      const count = isMobile ? 50 : 120
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
      }

      const MAX_DIST = isMobile ? 110 : 140
      const MAX_DIST_SQ = MAX_DIST * MAX_DIST

      // Triangle pass — desktop only
      if (!isMobile) {
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            const dx1 = points[i].x - points[j].x
            const dy1 = points[i].y - points[j].y
            if (dx1 * dx1 + dy1 * dy1 > MAX_DIST_SQ) continue

            for (let k = j + 1; k < points.length; k++) {
              const dx2 = points[i].x - points[k].x
              const dy2 = points[i].y - points[k].y
              if (dx2 * dx2 + dy2 * dy2 > MAX_DIST_SQ) continue

              const dx3 = points[j].x - points[k].x
              const dy3 = points[j].y - points[k].y
              if (dx3 * dx3 + dy3 * dy3 > MAX_DIST_SQ) continue

              ctx.beginPath()
              ctx.moveTo(points[i].x, points[i].y)
              ctx.lineTo(points[j].x, points[j].y)
              ctx.lineTo(points[k].x, points[k].y)
              ctx.closePath()
              ctx.fillStyle = 'rgba(232, 69, 60, 0.05)'
              ctx.fill()
            }
          }
        }
      }

      // Edge pass — both platforms (uses squared distance, avoids sqrt)
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const distSq = dx * dx + dy * dy
          if (distSq > MAX_DIST_SQ) continue

          const dist = Math.sqrt(distSq)
          const alpha = (1 - dist / MAX_DIST) * 0.08
          ctx.beginPath()
          ctx.moveTo(points[i].x, points[i].y)
          ctx.lineTo(points[j].x, points[j].y)
          ctx.strokeStyle = `rgba(200, 240, 77, ${alpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // Dot pass — both platforms
      ctx.fillStyle = 'rgba(232, 69, 60, 0.18)'
      for (let i = 0; i < points.length; i++) {
        ctx.beginPath()
        ctx.arc(points[i].x, points[i].y, 1.1, 0, Math.PI * 2)
        ctx.fill()
      }

      frameId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(frameId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        minHeight: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.45,
      }}
    />
  )
}