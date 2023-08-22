import { Input } from "@/components/ui/input";
import { GenericProperty } from "@/types/Scenefile";
import React, { ChangeEvent } from "react";

const SCROLL_SCALE = 0.1;

// a singleProperty is a GenericProperty without number[]
type SingleProperty = Exclude<GenericProperty, number[]>;

interface SingleInputProps {
  label: string;
  val: SingleProperty;
  onChange: (value: SingleProperty) => void;
}

const SingleInput: React.FC<SingleInputProps> = ({ label, val, onChange }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex justify-end items-center">
      <label className="mr-2">{label}</label>
      <Input
        className="max-w-[6rem] w-auto"
        type="number"
        value={val}
        onChange={handleChange}
      />
    </div>
  );
};

export default SingleInput;
