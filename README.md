# Run

1. First rename .env.example to .env and fill up the variables

```bash
    mv .env.example .env
```

2. Then run it using :

- bun :

```bash
    bun run --env-file=.env .\index.ts
```

- or Node :

```bash
    bun run --env-file=.env .\index.ts
```

# Exemple of params' schemas

- JSON Schema example :

```json
{
  "GRP1": {
    "XOPPNUM_": "",
    "XFCY_": "FR012",
    "XIPTDAT_": "20260421",
    "XVCRDES_": "Test form ts - 1",
    "XWRHE_": "",
    "XBPTNUM_": "",
    "XPLATE_": "",
    "XNB_": 1
  },
  "GRP2": [
    {
      "XSTOCOU_": 130,
      "XSEQ_": 0,
      "XQTYPCU_": 1,
      "XPCU_": "UN",
      "XPCUSTUCOE_": 1,
      "XQTYSTU_": 1,
      "XLOC_": "A1C14",
      "XSTA_": ""
    }
  ]
}
```

- XML Schema example

```xml
<?XML VERSION="1.0" ENCODING="UTF-8"?>
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
  <!-- **ATTENTION HERE : Chnage the GPR to TAB tag when web have dimension > 1 ** -->
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
```
