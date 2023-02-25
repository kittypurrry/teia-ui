import { createRef, useEffect, useState } from 'react'

export const Visualiser = ({ src }: { src: string }) => {
  const ref = createRef<HTMLCanvasElement>()
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [ratio, setRatio] = useState(1)
  const [audio, setAudio] = useState<HTMLAudioElement>()
  const [raf, setRaf] = useState<number>(0)
  const [data, setData] = useState<Float32Array>()
  const [analyser, setAnalyser] = useState<AnalyserNode>()

  useEffect(() => {
    setCtx(ref.current?.getContext('2d') || null)
    setRatio(Math.max(1, Math.min(global.devicePixelRatio, 2)))

    return () => {
      cancelAnimationFrame(raf)
    }
  }, [ref, raf])

  useEffect(() => {
    resize()
  })

  useEffect(() => {
    const _audio = new Audio()
    _audio.src = src
    _audio.controls = false
    _audio.loop = true
    _audio.autoplay = false
    _audio.crossOrigin = 'anonymous'

    setAudio(_audio)

    const audioCtx = new AudioContext()

    setAnalyser(audioCtx.createAnalyser())
    // analyser.fftSize = 2048

    if (audio && analyser) {
      const source = audioCtx.createMediaElementSource(audio)
      source.connect(analyser)
      source.connect(audioCtx.destination)
      const _data = new Float32Array(analyser.frequencyBinCount)
      setData(_data)

      analyser.getFloatTimeDomainData(_data)
    }
    //style = getComputedStyle(document.body)
  }, [analyser, audio, src, data])

  const play = () => {
    audio?.play()
    setRaf(requestAnimationFrame(update))
  }

  const pause = (reset?: boolean) => {
    audio?.pause()

    cancelAnimationFrame(raf)

    if (reset && audio) {
      audio.currentTime = 0
    }
  }

  const resize = () => {
    const width = 320
    const height = 320
    if (ctx) {
      ctx.canvas.width = width * ratio
      ctx.canvas.height = height * ratio
      ctx.canvas.style.width = `${width}px`
      ctx.canvas.style.height = `${height}px`
    }
  }

  const update = () => {
    if (!analyser || !ctx || !data) return
    // analyser.getByteFrequencyData(data)
    analyser.getFloatTimeDomainData(data)

    resize()

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // FIRST OPTION (traditional)
    // let space = ctx.canvas.width / data.length
    // data.forEach((value, i) => {
    //   ctx.beginPath()
    //   ctx.strokeStyle = 'red'
    //   ctx.moveTo(space * i, ctx.canvas.height) //x,y
    //   ctx.lineTo(space * i, ctx.canvas.height - value) //x,y
    //   ctx.stroke()
    // })

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.beginPath()

    for (let i = 0; i < data.length; i++) {
      const x = i
      const y = (0.5 + data[i] / 2) * ctx.canvas.height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.strokeStyle = 'var(--text-color)' //style.getPropertyValue('--text-color')
    ctx.lineWidth = 2 * global.devicePixelRatio
    ctx.stroke()
    setRaf(requestAnimationFrame(update))
  }

  return (
    <canvas
      onClick={() => {
        if (audio?.paused) {
          play()
        } else {
          pause()
        }
      }}
      ref={ref}
    ></canvas>
  )
}
