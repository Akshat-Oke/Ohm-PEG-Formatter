import { PEG } from "./PEG_formatter";
import { PrettyPrinter } from "./printer";
import fs from "fs";

let source = `asd {
  rule = is "here" --branch | here is another --br
}`;
try {
  const source = fs.readFileSync("../input.peg", "utf8");
  let peg = new PEG(source);
  let ohm = peg.parse();
  if (PEG.hadError) {
    process.exit();
  }
  const printer = new PrettyPrinter(ohm!);
  fs.writeFile("../output.peg", printer.getFormatterString(), (err) => {
    if (err) {
      console.error(err);
    }
    console.log("Formatted succesfully");
  });
} catch (err) {
  console.error(err);
}
