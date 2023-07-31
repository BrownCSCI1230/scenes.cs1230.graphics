import { GenericProperty } from '@/types/Scenefile';
import React, { ChangeEvent, WheelEvent } from 'react';

const SCROLL_SCALE = 0.1;

// a singleProperty is a GenericProperty without number[]
type SingleProperty = Exclude<GenericProperty, number[]>;

interface SingleInputProps {
  label: string;
  val: SingleProperty;
  onChange: (value: SingleProperty) => void;
}

const TripleInput: React.FC<SingleInputProps> = ({ label, val, onChange}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  return (
    <div className="flex items-center">
      <label className="mr-2"><i>{label}:</i></label>
      <input className="w-16 mr-2" type="number" value={val} onChange={handleChange} />
    </div>
  );
};

export default TripleInput;