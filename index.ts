/**
 *
 * @param params web server function params to call, be carefull the params should match the X3 @param operation params and the schemas (XML ou JSON)
 * @param webService Name of the web server function in X3
 * @param typeRequest The result response type, inside the xml tag <resultXml>
 * @param operation The operation to call in X3, see the list of operations
 * @param soapAction IDK, probalbly the soap Acion in the list of operations
 * @param trace activate or deactivate the functions trace call, in X3 web service
 */
async function callWS(
  params: string | Object,
  webService: string,
  typeRequest: "JSON" | "XML" = "JSON",
  operation:
    | "run"
    | "save"
    | "delete"
    | "read"
    | "query"
    | "getDescription"
    | "modify"
    | "actionObject"
    | "actionObjectKeys"
    | "getDataXmlSchema"
    | "insertLines"
    | "deleteLines" = "run",
  soapAction: string = "",
  trace: "on" | "off" = "off",
) {
  const xml = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wss="http://www.adonix.com/WSS">
     <soapenv:Header/>
     <soapenv:Body>
        <wss:${operation}  soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <callContext xsi:type="wss:CAdxCallContext">
              <codeLang xsi:type="xsd:string">${process.env.CODE_LANG}</codeLang>
              <poolAlias xsi:type="xsd:string">${process.env.POOL_ALIAS}</poolAlias>
              <poolId xsi:type="xsd:string">${process.env.POOL_ID}</poolId>
              <requestConfig xsi:type="xsd:string">adxwss.optreturn=${typeRequest}&adxwss.beautify=true&adxwss.trace.on=${trace}</requestConfig>
            </callContext>
            <publicName xsi:type="xsd:string">${webService}</publicName>
            <inputXml xsi:type="xsd:string">${typeRequest === "JSON" ? JSON.stringify(params) : "<![CDATA[" + params + "]]>"}</inputXml>
        </wss:${operation} >
     </soapenv:Body>
  </soapenv:Envelope>`;

  console.log(xml);

  // Transforms strings to base64 encoded string
  const auth = btoa(`${process.env.X3_USERNAME}:${process.env.X3_PASSWORD}`);

  // console.log(`${process.env.X3_USERNAME}:${process.env.X3_PASSWORD}`);
  const response = await fetch(process.env.URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml;charset=UTF-8",
      soapAction: `"${soapAction}"`, // required by Sage
      Authorization: `Basic ${auth}`,
    },
    body: xml,
  });

  const text = await response.text();
  console.log(text);
}

// JSON
// callWS(
//   {
//     GRP1: {
//       XOPPNUM_: "",
//       XFCY_: "FR012",
//       XIPTDAT_: "20260421",
//       XVCRDES_: "Test form ts - 1",
//       XWRHE_: "",
//       XBPTNUM_: "",
//       XPLATE_: "",
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
//   "ZTESTWS",
//   "JSON",
// ).catch(console.error);
// XML
const xml = `<?XML VERSION="1.0" ENCODING="UTF-8"?>
<PARAM>
  <GRP ID="GRP1">
    <FLD NAM="XOPPNUM_"></FLD>
    <FLD NAM="XFCY_" >FR012</FLD>
    <FLD NAM="XIPTDAT_" >20260424</FLD>
    <FLD NAM="XVCRDES_" >Test from ts - xml</FLD>
    <FLD NAM="XWRHE_" ></FLD>
    <FLD NAM="XBPTNUM_" ></FLD>
    <FLD NAM="XPLATE_" ></FLD>
    <FLD NAM="XNB_" >1</FLD>
  </GRP>
  <TAB DIM="100" ID="GRP2" SIZE="1">
    <LIN NUM="1" >
      <FLD NAM="XSTOCOU_">130</FLD>
      <FLD NAM="XSEQ_" >0</FLD>
      <FLD NAM="XQTYPCU_" >1</FLD>
      <FLD NAM="XPCU_">UN</FLD>
      <FLD NAM="XPCUSTUCOE_" >1</FLD>
      <FLD NAM="XQTYSTU_" >1</FLD>
      <FLD NAM="XLOC_">A1C14</FLD>
      <FLD NAM="XSTA_">A</FLD>
    </LIN>
  </TAB>
</PARAM>
`;
callWS(xml, "ZTESTWS", "XML").catch(console.error);
