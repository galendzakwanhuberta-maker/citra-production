// Geser jari kiri/kanan di layar sentuh.
export function useSwipe(onNext, onPrev) {
  let x = null
  return {
    onTouchstart: (e) => { x = e.touches[0].clientX },
    onTouchend: (e) => {
      if (x === null) return
      const d = e.changedTouches[0].clientX - x; x = null
      if (Math.abs(d) > 40) (d < 0 ? onNext : onPrev)()
    },
  }
}
