interface ControlsProps {
  showLabels: boolean
  onToggleLabels: () => void
}

function Controls({ showLabels, onToggleLabels }: ControlsProps) {
  return (
    <div className="flex items-center gap-4 text-neutral-200">
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showLabels}
          onChange={onToggleLabels}
          className="h-4 w-4"
        />
        Show key labels
      </label>
    </div>
  )
}

export default Controls
