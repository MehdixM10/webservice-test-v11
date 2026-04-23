async function callWS(
  args: string | Object,
  webService: string,
  soapAction: string = "",
  typeRequest: "JSON" | "XML" = "JSON",
) {
  const xml = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wss="http://www.adonix.com/WSS">
   <soapenv:Header/>
   <soapenv:Body>
      <wss:run soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
         <callContext xsi:type="wss:CAdxCallContext">
            <codeLang xsi:type="xsd:string">${process.env.CODE_LANG}</codeLang>
            <poolAlias xsi:type="xsd:string">${process.env.POOL_ALIAS}</poolAlias>
            <poolId xsi:type="xsd:string">${process.env.POOL_ID}</poolId>
            <requestConfig xsi:type="xsd:string">adxwss.optreturn=${typeRequest}&amp;adxwss.beautify=true</requestConfig>
         </callContext>
         <publicName xsi:type="xsd:string">${webService}</publicName>
         <inputXml xsi:type="xsd:string">${typeRequest === "JSON" ? JSON.stringify(args) : args}</inputXml>
      </wss:run>
   </soapenv:Body>
</soapenv:Envelope>`;

  // Transforms strings to base64 encoded string
  const auth = btoa(`${process.env.X3_USERNAME}:${process.env.X3_PASSWORD}`);

  // console.log(`${process.env.X3_USERNAME}:${process.env.X3_PASSWORD}`);
  const response = await fetch(process.env.URL, {
    method: "POST",
    headers: {
      "Content-Type": `${typeRequest === "JSON" ? "application/json" : "text/xml"};charset=UTF-8`,
      soapAction: `"${soapAction}"`, // required by Sage
      Authorization: `Basic ${auth}`,
    },
    body: xml,
  });

  const data = await response.text();
  console.log(data);
}

// JSON
callWS(
  {
    GRP1: { I_MODEXP: "ITM", I_CHRONO: "NO" },
    GRP2: [{ I_TCRITERE: "ITMSTA=1" }, { I_TCRITERE: "1=1" }],
    GRP3: { I_EXEC: "REALTIME", I_RECORDSEP: "|" },
  },
  "AOWSEXPORT",
).catch(console.error);
