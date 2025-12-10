import { useMemo } from 'react'

interface TensorVizProps {
  data: number[] | number[][] | number[][][]
  shape?: number[]
  label?: string
}

function getColorForValue(value: number, min: number, max: number): string {
  if (min === max) return 'rgb(100, 100, 100)'

  const normalized = (value - min) / (max - min)

  // PyTorch orange gradient
  const r = Math.round(30 + normalized * (238 - 30))
  const g = Math.round(30 + normalized * (76 - 30))
  const b = Math.round(46 + normalized * (44 - 46))

  return `rgb(${r}, ${g}, ${b})`
}

function flattenArray(arr: number[] | number[][] | number[][][]): number[] {
  const result: number[] = []

  function flatten(item: number | number[] | number[][] | number[][][]) {
    if (Array.isArray(item)) {
      item.forEach(flatten)
    } else {
      result.push(item)
    }
  }

  flatten(arr)
  return result
}

function Tensor1D({ data, min, max }: { data: number[]; min: number; max: number }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {data.map((value, i) => (
        <div
          key={i}
          className="tensor-cell w-12 h-10 flex items-center justify-center rounded text-xs"
          style={{ backgroundColor: getColorForValue(value, min, max) }}
          title={`[${i}] = ${value}`}
        >
          {value.toFixed(2)}
        </div>
      ))}
    </div>
  )
}

function Tensor2D({ data, min, max }: { data: number[][]; min: number; max: number }) {
  return (
    <div className="inline-block">
      {data.map((row, i) => (
        <div key={i} className="flex gap-1 mb-1">
          {row.map((value, j) => (
            <div
              key={j}
              className="tensor-cell w-12 h-10 flex items-center justify-center rounded text-xs"
              style={{ backgroundColor: getColorForValue(value, min, max) }}
              title={`[${i}, ${j}] = ${value}`}
            >
              {value.toFixed(2)}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function Tensor3D({ data, min, max }: { data: number[][][]; min: number; max: number }) {
  return (
    <div className="flex gap-4 flex-wrap">
      {data.map((matrix, i) => (
        <div key={i} className="space-y-1">
          <span className="text-xs text-dark-muted">Channel {i}</span>
          <Tensor2D data={matrix} min={min} max={max} />
        </div>
      ))}
    </div>
  )
}

export function TensorViz({ data, shape, label }: TensorVizProps) {
  const { flatData, min, max, inferredShape } = useMemo(() => {
    const flatData = flattenArray(data)
    const min = Math.min(...flatData)
    const max = Math.max(...flatData)

    // Infer shape if not provided
    let inferredShape = shape
    if (!inferredShape) {
      if (!Array.isArray(data[0])) {
        inferredShape = [data.length]
      } else if (!Array.isArray((data as number[][])[0][0])) {
        inferredShape = [data.length, (data as number[][])[0].length]
      } else {
        inferredShape = [
          data.length,
          (data as number[][][])[0].length,
          (data as number[][][])[0][0].length,
        ]
      }
    }

    return { flatData, min, max, inferredShape }
  }, [data, shape])

  const ndim = inferredShape.length

  return (
    <div className="my-4 p-4 bg-dark-surface rounded-lg border border-dark-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {label && <span className="text-sm font-medium text-dark-text">{label}</span>}
          <span className="text-xs text-dark-muted font-mono">
            shape: ({inferredShape.join(', ')})
          </span>
        </div>
        <div className="text-xs text-dark-muted">
          min: {min.toFixed(2)} | max: {max.toFixed(2)}
        </div>
      </div>

      <div className="tensor-viz overflow-x-auto">
        {ndim === 1 && <Tensor1D data={data as number[]} min={min} max={max} />}
        {ndim === 2 && <Tensor2D data={data as number[][]} min={min} max={max} />}
        {ndim === 3 && <Tensor3D data={data as number[][][]} min={min} max={max} />}
      </div>
    </div>
  )
}
