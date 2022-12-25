import { useRef } from "react";

export default function useDataRef<T>(data: T) {
  const ref = useRef(data)
  if (ref.current !== data) ref.current = data
  return ref
}