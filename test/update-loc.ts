import { callWS } from "..";

// JSON
// callWS(
//   "ZTESTWS",
//   {
//     GRP1: {
//       XOPPNUM_: "",
//       XFCY_: "FR012",
//       XIPTDAT_: "20260421",
//       XVCRDES_: "Test form ts - 1",
//       XWRHE_: "",
//       XNB_: 1,
//     },
//     GRP2: [
//       {
//         XSTOCOU_: 130,
//         XSEQ_: 0,
//         XQTYPCU_: 1,
//         XPCU_: "UN",
//         XPCUSTUCOE_: 1,
//         XQTYSTU_: 1,
//         XLOC_: "A1C14",
//         XSTA_: "",
//       },
//     ],
//   },
//  ["XERR_", "XSTA_", "XLOC_", "XCHGNUM_"],
//   "JSON",
// )
//   .then(console.log)
//   .catch(console.error);

// XML
const xml = `<?XML VERSION="1.0" ENCODING="UTF-8"?>
<PARAM>
  <GRP ID="GRP1">
    <FLD NAM="XOPPNUM_"></FLD>
    <FLD NAM="XFCY_" >FR012</FLD>
    <FLD NAM="XIPTDAT_" >20260522</FLD>
    <FLD NAM="XVCRDES_" >Test from ts - xml</FLD>
    <FLD NAM="XWRHE_" ></FLD>
    <FLD NAM="XNB_" >1</FLD>
  </GRP>
  <TAB DIM="100" ID="GRP2" SIZE="1">
    <LIN NUM="1" >
      <FLD NAM="XSTOCOU_">130</FLD>
      <FLD NAM="XSEQ_" >0</FLD>
      <FLD NAM="XQTYPCU_" >0</FLD>
      <FLD NAM="XPCU_">UN</FLD>
      <FLD NAM="XPCUSTUCOE_" >1</FLD>
      <FLD NAM="XQTYSTU_" >0</FLD>
      <FLD NAM="XLOC_">A1C14</FLD>
      <FLD NAM="XSTA_">A</FLD>
    </LIN>
  </TAB>
</PARAM>
`;
callWS(
  "ZCHANGEWS",
  xml,
  ["XERR_", "XSTA_", "XLOC_", "XCHGNUM_"],
  "XML",
  "run",
  "off",
)
  .then(console.log)
  .catch((err) => console.error(err.message));
