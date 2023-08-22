import React, { ChangeEvent, WheelEvent } from "react";

const SCROLL_SCALE = 0.1;

interface TripleInputProps {
  label: string;
  x: number;
  y: number;
  z: number;
  onXChange: (value: number) => void;
  onYChange: (value: number) => void;
  onZChange: (value: number) => void;
}

const TripleInput: React.FC<TripleInputProps> = ({
  label,
  x,
  y,
  z,
  onXChange,
  onYChange,
  onZChange,
}) => {
  const handleXChange = (event: ChangeEvent<HTMLInputElement>) => {
    onXChange(parseFloat(event.target.value));
  };

  const handleYChange = (event: ChangeEvent<HTMLInputElement>) => {
    onYChange(parseFloat(event.target.value));
  };

  const handleZChange = (event: ChangeEvent<HTMLInputElement>) => {
    onZChange(parseFloat(event.target.value));
  };

  const handleWheelX = (event: WheelEvent<HTMLInputElement>) => {
    const step = event.deltaY > 0 ? -1 : 1;
    onXChange(parseFloat((x + step * SCROLL_SCALE).toFixed(2)));
  };

  const handleWheelY = (event: WheelEvent<HTMLInputElement>) => {
    const step = event.deltaY > 0 ? -1 : 1;
    onYChange(parseFloat((y + step * SCROLL_SCALE).toFixed(2)));
  };

  const handleWheelZ = (event: WheelEvent<HTMLInputElement>) => {
    const step = event.deltaY > 0 ? -1 : 1;
    onZChange(parseFloat((z + step * SCROLL_SCALE).toFixed(2)));
  };

  return (
    <div className="flex items-center justify-end">
      <label className="mr-2">
        <i>{label}:</i>
      </label>
      <input
        className="w-16 mr-2"
        type="number"
        value={x}
        onChange={handleXChange}
        onWheel={handleWheelX}
      />
      <input
        className="w-16 mr-2"
        type="number"
        value={y}
        onChange={handleYChange}
        onWheel={handleWheelY}
      />
      <input
        className="w-16"
        type="number"
        value={z}
        onChange={handleZChange}
        onWheel={handleWheelZ}
      />
    </div>
  );
};

export default TripleInput;
