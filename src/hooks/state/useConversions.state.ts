import { useEffect } from "react";
import { useCurrentContext } from "../context.hook";
import { conversionStore } from "../../instances/conversionsStore";

export const useConversions = () => {
  const { conversions, setConversions } = useCurrentContext();

  const addConversion = (conversion: string) => {
    setConversions([...conversions, conversion]);
  };

  const removeConversion = (conversion: string) => {
    setConversions(conversions.filter((c) => c !== conversion));
  };

  return {
    conversions,
    addConversion,
    removeConversion,
  };
};
