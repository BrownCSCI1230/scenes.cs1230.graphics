import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useScenefile from "@/hooks/useScenefile";

export default function Outline() {
  const { scenefile } = useScenefile();

  return <div>Outline</div>;
}
