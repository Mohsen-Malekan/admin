import get from "lodash/get";
import { primary, fontFamily } from "./options";

export default function treemapOptions(instance, savedOptions) {
  const direction = "rtl";
  const name = get(instance, "name", "");

  return {
    title: {
      show: true,
      text: name,
      textAlign: "left",
      [direction === "rtl" ? "right" : "left"]: "32px",
      textStyle: {
        fontSize: 18,
        fontWeight: "lighter",
        color: primary[500]
      }
    },
    tooltip: {
      formatter: "{a} <br/>{b} : {c}"
    },
    textStyle: {
      fontFamily
    }
  };
}
