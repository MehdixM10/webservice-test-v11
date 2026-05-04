import { callWS } from "..";

// XML changement dans itmfacilit
const xmlITF = `<?XML VERSION="1.0" ENCODING="UTF-8"?>
<PARAM>
  <GRP ID="ENTRE">
    <FLD NAM="ITMREF">DIS004</FLD>
    <FLD NAM="DEPOT" ></FLD>
    <FLD NAM="SITESTOCK" >FR012</FLD>
    <FLD NAM="DEFLOC" >*</FLD>
    <FLD NAM="DEFLOCTYP" >*</FLD>
  </GRP>
</PARAM>
`;
// XML changement dans itmwrh
const xmlWRH = `<?XML VERSION="1.0" ENCODING="UTF-8"?>
<PARAM>
  <GRP ID="ENTRE">
    <FLD NAM="ITMREF">BMS055</FLD>
    <FLD NAM="DEPOT" >FR221</FLD>
    <FLD NAM="SITESTOCK" >FR022</FLD>
    <FLD NAM="DEFLOC" >A01B5</FLD>
    <FLD NAM="DEFLOCTYP" >REC</FLD>
  </GRP>
</PARAM>
`;
Promise.all([
  callWS(
    "ZCHANGDEWS",
    xmlITF,
    ["CODEERREUR", "DEFLOC", "DEFLOCTYP"],
    "XML",
    "run",
    "on",
  ),
  callWS(
    "ZCHANGDEWS",
    xmlWRH,
    ["CODEERREUR", "DEFLOC", "DEFLOCTYP"],
    "XML",
    "run",
    "off",
  ),
])
  .then(console.log)
  .catch((err) => console.error(err.message));
