function suanfa(event, target) {
  var initData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var isInitData = Object.keys(initData).length > 0;
  var MAX = uData.utils.Max;
  var INT = uData.utils.Int;
  var INTUP = function INTUP(num) {
    return Math.ceil(num);
  };
  var M = uData.utils.Fixed;
  var _params$targetId = this.params.targetId,
      targetId = _params$targetId === undefined ? "" : _params$targetId;

  var dxcs01 = this.$("selectField_mbh9rxzr").getValue() || 0;
  var dxcs01ConfigData = uData.utils.getPickerData({ instanceId: dxcs01, arr: uData.organConfig.dxcs, key: "id" });
  var _dxcs01ConfigData$tex = dxcs01ConfigData.textField_aebpowa,
      dx01 = _dxcs01ConfigData$tex === undefined ? "" : _dxcs01ConfigData$tex,
      _dxcs01ConfigData$num = dxcs01ConfigData.numberField_m3scko07,
      dx02 = _dxcs01ConfigData$num === undefined ? 0 : _dxcs01ConfigData$num,
      _dxcs01ConfigData$num2 = dxcs01ConfigData.numberField_m3scko0c,
      dx03 = _dxcs01ConfigData$num2 === undefined ? 0 : _dxcs01ConfigData$num2,
      _dxcs01ConfigData$num3 = dxcs01ConfigData.numberField_m3scko0e,
      dx04 = _dxcs01ConfigData$num3 === undefined ? 0 : _dxcs01ConfigData$num3,
      _dxcs01ConfigData$num4 = dxcs01ConfigData.numberField_sr3it9l,
      cx01 = _dxcs01ConfigData$num4 === undefined ? 0 : _dxcs01ConfigData$num4,
      _dxcs01ConfigData$num5 = dxcs01ConfigData.numberField_jp4n9ji,
      cx02 = _dxcs01ConfigData$num5 === undefined ? 0 : _dxcs01ConfigData$num5,
      _dxcs01ConfigData$num6 = dxcs01ConfigData.numberField_0uftxut,
      cx03 = _dxcs01ConfigData$num6 === undefined ? 0 : _dxcs01ConfigData$num6,
      _dxcs01ConfigData$num7 = dxcs01ConfigData.numberField_pa53oxu,
      cx04 = _dxcs01ConfigData$num7 === undefined ? 0 : _dxcs01ConfigData$num7,
      _dxcs01ConfigData$num8 = dxcs01ConfigData.numberField_5g6jfhb,
      cx05 = _dxcs01ConfigData$num8 === undefined ? 0 : _dxcs01ConfigData$num8,
      _dxcs01ConfigData$num9 = dxcs01ConfigData.numberField_pcvfrf7,
      cx06 = _dxcs01ConfigData$num9 === undefined ? 0 : _dxcs01ConfigData$num9,
      _dxcs01ConfigData$num10 = dxcs01ConfigData.numberField_d7relhf,
      cx07 = _dxcs01ConfigData$num10 === undefined ? 0 : _dxcs01ConfigData$num10,
      _dxcs01ConfigData$num11 = dxcs01ConfigData.numberField_ql7spz9,
      cx08 = _dxcs01ConfigData$num11 === undefined ? 0 : _dxcs01ConfigData$num11,
      _dxcs01ConfigData$num12 = dxcs01ConfigData.numberField_nfmnut4,
      cx09 = _dxcs01ConfigData$num12 === undefined ? 0 : _dxcs01ConfigData$num12,
      _dxcs01ConfigData$num13 = dxcs01ConfigData.numberField_04m4hcc,
      zd01 = _dxcs01ConfigData$num13 === undefined ? 0 : _dxcs01ConfigData$num13,
      _dxcs01ConfigData$num14 = dxcs01ConfigData.numberField_6mnwv9s,
      zd02 = _dxcs01ConfigData$num14 === undefined ? 0 : _dxcs01ConfigData$num14,
      _dxcs01ConfigData$num15 = dxcs01ConfigData.numberField_p1bf4ns,
      zd03 = _dxcs01ConfigData$num15 === undefined ? 0 : _dxcs01ConfigData$num15,
      _dxcs01ConfigData$num16 = dxcs01ConfigData.numberField_g43sr0l,
      zd04 = _dxcs01ConfigData$num16 === undefined ? 0 : _dxcs01ConfigData$num16,
      _dxcs01ConfigData$num17 = dxcs01ConfigData.numberField_v5vysyo,
      zd05 = _dxcs01ConfigData$num17 === undefined ? 0 : _dxcs01ConfigData$num17,
      _dxcs01ConfigData$num18 = dxcs01ConfigData.numberField_wngzhey,
      zd06 = _dxcs01ConfigData$num18 === undefined ? 0 : _dxcs01ConfigData$num18,
      _dxcs01ConfigData$num19 = dxcs01ConfigData.numberField_j1n802r,
      zd07 = _dxcs01ConfigData$num19 === undefined ? 0 : _dxcs01ConfigData$num19,
      _dxcs01ConfigData$tex2 = dxcs01ConfigData.textField_wa1ust1,
      zd08 = _dxcs01ConfigData$tex2 === undefined ? "" : _dxcs01ConfigData$tex2,
      _dxcs01ConfigData$num20 = dxcs01ConfigData.numberField_mevfg077,
      zd09 = _dxcs01ConfigData$num20 === undefined ? 0 : _dxcs01ConfigData$num20;

  var ysc01 = this.$("selectField_mb98893i").getValue() || 0;
  var ysc01ConfigData = uData.utils.getPickerData({ instanceId: ysc01, arr: uData.organConfig.clk, key: "id" });
  var _ysc01ConfigData$text = ysc01ConfigData.textField_nohaph9,
      yc_dj01 = _ysc01ConfigData$text === undefined ? 0 : _ysc01ConfigData$text,
      _ysc01ConfigData$text2 = ysc01ConfigData.textField_2xfswer,
      yc_md01 = _ysc01ConfigData$text2 === undefined ? 0 : _ysc01ConfigData$text2,
      _ysc01ConfigData$text3 = ysc01ConfigData.textField_09zzudc,
      yc_hd01 = _ysc01ConfigData$text3 === undefined ? 0 : _ysc01ConfigData$text3,
      _ysc01ConfigData$text4 = ysc01ConfigData.textField_e5iy0au,
      yc_mc01 = _ysc01ConfigData$text4 === undefined ? "" : _ysc01ConfigData$text4;

  var zgc01 = this.$("selectField_mb98893j").getValue() || 0;
  var zgc01ConfigData = uData.utils.getPickerData({ instanceId: zgc01, arr: uData.organConfig.clk, key: "id" });
  var _zgc01ConfigData$text = zgc01ConfigData.textField_nohaph9,
      zc1_dj01 = _zgc01ConfigData$text === undefined ? 0 : _zgc01ConfigData$text,
      _zgc01ConfigData$text2 = zgc01ConfigData.textField_2xfswer,
      zc1_md01 = _zgc01ConfigData$text2 === undefined ? 0 : _zgc01ConfigData$text2,
      _zgc01ConfigData$text3 = zgc01ConfigData.textField_09zzudc,
      zc1_hd01 = _zgc01ConfigData$text3 === undefined ? 0 : _zgc01ConfigData$text3,
      _zgc01ConfigData$text4 = zgc01ConfigData.textField_e5iy0au,
      zc1_mc01 = _zgc01ConfigData$text4 === undefined ? "" : _zgc01ConfigData$text4;

  var zgc02 = this.$("selectField_mb98893k").getValue() || 0;
  var zgc02ConfigData = uData.utils.getPickerData({ instanceId: zgc02, arr: uData.organConfig.clk, key: "id" });
  var _zgc02ConfigData$text = zgc02ConfigData.textField_nohaph9,
      zc2_dj01 = _zgc02ConfigData$text === undefined ? 0 : _zgc02ConfigData$text,
      _zgc02ConfigData$text2 = zgc02ConfigData.textField_2xfswer,
      zc2_md01 = _zgc02ConfigData$text2 === undefined ? 0 : _zgc02ConfigData$text2,
      _zgc02ConfigData$text3 = zgc02ConfigData.textField_09zzudc,
      zc2_hd01 = _zgc02ConfigData$text3 === undefined ? 0 : _zgc02ConfigData$text3,
      _zgc02ConfigData$text4 = zgc02ConfigData.textField_e5iy0au,
      zc2_mc01 = _zgc02ConfigData$text4 === undefined ? "" : _zgc02ConfigData$text4;

  var zgc03 = this.$("selectField_mb98893l").getValue() || 0;
  var zgc03ConfigData = uData.utils.getPickerData({ instanceId: zgc03, arr: uData.organConfig.clk, key: "id" });
  var _zgc03ConfigData$text = zgc03ConfigData.textField_nohaph9,
      zc3_dj01 = _zgc03ConfigData$text === undefined ? 0 : _zgc03ConfigData$text,
      _zgc03ConfigData$text2 = zgc03ConfigData.textField_2xfswer,
      zc3_md01 = _zgc03ConfigData$text2 === undefined ? 0 : _zgc03ConfigData$text2,
      _zgc03ConfigData$text3 = zgc03ConfigData.textField_09zzudc,
      zc3_hd01 = _zgc03ConfigData$text3 === undefined ? 0 : _zgc03ConfigData$text3,
      _zgc03ConfigData$text4 = zgc03ConfigData.textField_e5iy0au,
      zc3_mc01 = _zgc03ConfigData$text4 === undefined ? "" : _zgc03ConfigData$text4;

  var rfc01 = this.$("selectField_mb98893m").getValue() || 0;
  var rfc01ConfigData = uData.utils.getPickerData({ instanceId: rfc01, arr: uData.organConfig.clk, key: "id" });
  var _rfc01ConfigData$text = rfc01ConfigData.textField_nohaph9,
      rc_dj01 = _rfc01ConfigData$text === undefined ? 0 : _rfc01ConfigData$text,
      _rfc01ConfigData$text2 = rfc01ConfigData.textField_2xfswer,
      rc_md01 = _rfc01ConfigData$text2 === undefined ? 0 : _rfc01ConfigData$text2,
      _rfc01ConfigData$text3 = rfc01ConfigData.textField_09zzudc,
      rc_hd01 = _rfc01ConfigData$text3 === undefined ? 0 : _rfc01ConfigData$text3,
      _rfc01ConfigData$text4 = rfc01ConfigData.textField_e5iy0au,
      rc_mc01 = _rfc01ConfigData$text4 === undefined ? "" : _rfc01ConfigData$text4;

  var ys01 = this.$("selectField_mbg8tmyt").getValue() || 0;
  var ys01ConfigData = uData.utils.getPickerData({ instanceId: ys01, arr: uData.organConfig.gxcb, key: "id" });
  var _ys01ConfigData$numbe = ys01ConfigData.numberField_w5opr46,
      gx_ys01 = _ys01ConfigData$numbe === undefined ? 0 : _ys01ConfigData$numbe,
      _ys01ConfigData$numbe2 = ys01ConfigData.numberField_c2jyl6f,
      gx_ys02 = _ys01ConfigData$numbe2 === undefined ? 0 : _ys01ConfigData$numbe2,
      _ys01ConfigData$numbe3 = ys01ConfigData.numberField_z7tpaby,
      gx_ys03 = _ys01ConfigData$numbe3 === undefined ? 0 : _ys01ConfigData$numbe3,
      _ys01ConfigData$numbe4 = ys01ConfigData.numberField_m3nt133e,
      gx_ys04 = _ys01ConfigData$numbe4 === undefined ? 0 : _ys01ConfigData$numbe4,
      _ys01ConfigData$numbe5 = ys01ConfigData.numberField_m3nt133f,
      gx_ys05 = _ys01ConfigData$numbe5 === undefined ? 0 : _ys01ConfigData$numbe5,
      _ys01ConfigData$numbe6 = ys01ConfigData.numberField_m4j9yazi,
      gx_ys06 = _ys01ConfigData$numbe6 === undefined ? 0 : _ys01ConfigData$numbe6,
      _ys01ConfigData$textF = ys01ConfigData.textField_dzk31za,
      gx_ys07 = _ys01ConfigData$textF === undefined ? "" : _ys01ConfigData$textF;

  var uv01 = this.$("selectField_mbg8tmyu").getValue() || 0;
  var uv01ConfigData = uData.utils.getPickerData({ instanceId: uv01, arr: uData.organConfig.gxcb, key: "id" });
  var _uv01ConfigData$numbe = uv01ConfigData.numberField_w5opr46,
      gx_uv01 = _uv01ConfigData$numbe === undefined ? 0 : _uv01ConfigData$numbe,
      _uv01ConfigData$numbe2 = uv01ConfigData.numberField_c2jyl6f,
      gx_uv02 = _uv01ConfigData$numbe2 === undefined ? 0 : _uv01ConfigData$numbe2,
      _uv01ConfigData$numbe3 = uv01ConfigData.numberField_z7tpaby,
      gx_uv03 = _uv01ConfigData$numbe3 === undefined ? 0 : _uv01ConfigData$numbe3,
      _uv01ConfigData$numbe4 = uv01ConfigData.numberField_m3nt133e,
      gx_uv04 = _uv01ConfigData$numbe4 === undefined ? 0 : _uv01ConfigData$numbe4,
      _uv01ConfigData$numbe5 = uv01ConfigData.numberField_m3nt133f,
      gx_uv05 = _uv01ConfigData$numbe5 === undefined ? 0 : _uv01ConfigData$numbe5,
      _uv01ConfigData$numbe6 = uv01ConfigData.numberField_m4j9yazi,
      gx_uv06 = _uv01ConfigData$numbe6 === undefined ? 0 : _uv01ConfigData$numbe6,
      _uv01ConfigData$textF = uv01ConfigData.textField_dzk31za,
      gx_uv07 = _uv01ConfigData$textF === undefined ? "" : _uv01ConfigData$textF;

  var xz01 = this.$("selectField_mbg8tmyv").getValue() || 0;
  var xz01ConfigData = uData.utils.getPickerData({ instanceId: xz01, arr: uData.organConfig.gxcb, key: "id" });
  var _xz01ConfigData$numbe = xz01ConfigData.numberField_w5opr46,
      gx_xz01 = _xz01ConfigData$numbe === undefined ? 0 : _xz01ConfigData$numbe,
      _xz01ConfigData$numbe2 = xz01ConfigData.numberField_c2jyl6f,
      gx_xz02 = _xz01ConfigData$numbe2 === undefined ? 0 : _xz01ConfigData$numbe2,
      _xz01ConfigData$numbe3 = xz01ConfigData.numberField_z7tpaby,
      gx_xz03 = _xz01ConfigData$numbe3 === undefined ? 0 : _xz01ConfigData$numbe3,
      _xz01ConfigData$numbe4 = xz01ConfigData.numberField_m3nt133e,
      gx_xz04 = _xz01ConfigData$numbe4 === undefined ? 0 : _xz01ConfigData$numbe4,
      _xz01ConfigData$numbe5 = xz01ConfigData.numberField_m3nt133f,
      gx_xz05 = _xz01ConfigData$numbe5 === undefined ? 0 : _xz01ConfigData$numbe5,
      _xz01ConfigData$numbe6 = xz01ConfigData.numberField_m4j9yazi,
      gx_xz06 = _xz01ConfigData$numbe6 === undefined ? 0 : _xz01ConfigData$numbe6,
      _xz01ConfigData$textF = xz01ConfigData.textField_dzk31za,
      gx_xz07 = _xz01ConfigData$textF === undefined ? "" : _xz01ConfigData$textF;

  var stk01 = this.$("selectField_mbg8tmyw").getValue() || 0;
  var stk01ConfigData = uData.utils.getPickerData({ instanceId: stk01, arr: uData.organConfig.gxcb, key: "id" });
  var _stk01ConfigData$numb = stk01ConfigData.numberField_w5opr46,
      gx_stk01 = _stk01ConfigData$numb === undefined ? 0 : _stk01ConfigData$numb,
      _stk01ConfigData$numb2 = stk01ConfigData.numberField_c2jyl6f,
      gx_stk02 = _stk01ConfigData$numb2 === undefined ? 0 : _stk01ConfigData$numb2,
      _stk01ConfigData$numb3 = stk01ConfigData.numberField_z7tpaby,
      gx_stk03 = _stk01ConfigData$numb3 === undefined ? 0 : _stk01ConfigData$numb3,
      _stk01ConfigData$numb4 = stk01ConfigData.numberField_m3nt133e,
      gx_stk04 = _stk01ConfigData$numb4 === undefined ? 0 : _stk01ConfigData$numb4,
      _stk01ConfigData$numb5 = stk01ConfigData.numberField_m3nt133f,
      gx_stk05 = _stk01ConfigData$numb5 === undefined ? 0 : _stk01ConfigData$numb5,
      _stk01ConfigData$numb6 = stk01ConfigData.numberField_m4j9yazi,
      gx_stk06 = _stk01ConfigData$numb6 === undefined ? 0 : _stk01ConfigData$numb6,
      _stk01ConfigData$text = stk01ConfigData.textField_dzk31za,
      gx_stk07 = _stk01ConfigData$text === undefined ? "" : _stk01ConfigData$text;

  var tqf01 = this.$("selectField_mbg8tmyx").getValue() || 0;
  var tqf01ConfigData = uData.utils.getPickerData({ instanceId: tqf01, arr: uData.organConfig.gxcb, key: "id" });
  var _tqf01ConfigData$numb = tqf01ConfigData.numberField_w5opr46,
      gx_tqf01 = _tqf01ConfigData$numb === undefined ? 0 : _tqf01ConfigData$numb,
      _tqf01ConfigData$numb2 = tqf01ConfigData.numberField_c2jyl6f,
      gx_tqf02 = _tqf01ConfigData$numb2 === undefined ? 0 : _tqf01ConfigData$numb2,
      _tqf01ConfigData$numb3 = tqf01ConfigData.numberField_z7tpaby,
      gx_tqf03 = _tqf01ConfigData$numb3 === undefined ? 0 : _tqf01ConfigData$numb3,
      _tqf01ConfigData$numb4 = tqf01ConfigData.numberField_m3nt133e,
      gx_tqf04 = _tqf01ConfigData$numb4 === undefined ? 0 : _tqf01ConfigData$numb4,
      _tqf01ConfigData$numb5 = tqf01ConfigData.numberField_m3nt133f,
      gx_tqf05 = _tqf01ConfigData$numb5 === undefined ? 0 : _tqf01ConfigData$numb5,
      _tqf01ConfigData$numb6 = tqf01ConfigData.numberField_m4j9yazi,
      gx_tqf06 = _tqf01ConfigData$numb6 === undefined ? 0 : _tqf01ConfigData$numb6,
      _tqf01ConfigData$text = tqf01ConfigData.textField_dzk31za,
      gx_tqf07 = _tqf01ConfigData$text === undefined ? "" : _tqf01ConfigData$text;

  var gg_zkl = this.$("numberField_m3myrtut").getValue() || 0;
  var kg_dbfs = this.$('selectField_mejq1x3p').getValue() || "";
  if (kg_dbfs === "连底") {
    kg_dbfs = 1;
  }
  if (kg_dbfs === "贴底(底印刷)") {
    kg_dbfs = 2;
  }
  if (kg_dbfs === "贴底(底不印)") {
    kg_dbfs = 3;
  }
  if (kg_dbfs === "正背底分开(底印刷)") {
    kg_dbfs = 4;
  }
  if (kg_dbfs === "正背底分开(底不印)") {
    kg_dbfs = 5;
  }
  var dw01 = this.state.ggdw == "cm" ? 1 : 0.1;
  var dw02 = this.state.hddw == "丝" ? 1 : 0.1;
  var gg_gd = Math.round((this.$("numberField_lw38f785").getValue() || 0) * dw01 * 10) / 10;
  var gg_kd = Math.round((this.$("numberField_lw38f76z").getValue() || 0) * dw01 * 10) / 10;
  var gg_db = Math.round((this.$('numberField_m3pstfde').getValue() || 0) * dw01 * 10) / 10;
  var gg_hd = Math.round((this.$("numberField_lw38f786").getValue() || 0) * dw02 * 10) / 10;
  var gg_sl = initData.gg_sl || this.$("numberField_lw38f787").getValue() || 0;
  var gg_ks = this.$("numberField_lxebzkcu").getValue() || 1;
  var gg_cbsf = this.$("numberField_l8vdkaug").getValue() || 0;
  var qt00 = this.$("numberField_m3ns67iv").getValue() || 0;
  var qt01 = uData.organConfig.qtcs.numberField_c2jyl6f || 0;
  var qt02 = uData.organConfig.qtcs.numberField_m3mqrw25 || 0;
  var qt03 = uData.organConfig.qtcs.numberField_m3mqrw27 || 0;
  var qt04 = uData.organConfig.qtcs.numberField_m3r8ld40 || 0;
  var qt05 = uData.organConfig.qtcs.numberField_m3mqrw29 || 0;
  var qt06 = uData.organConfig.qtcs.numberField_m3r45psz || 0;
  var qt07 = uData.organConfig.qtcs.numberField_m3mqrw28 || 0;
  var qt08 = uData.organConfig.qtcs.numberField_m3twpjpg || 0;
  var qt09 = uData.organConfig.qtcs.numberField_m3mya4ce || 0;
  var qt10 = uData.organConfig.qtcs.numberField_m49a7f6d || 0;
  var qt11 = uData.organConfig.qtcs.numberField_m539mea9 || 0;
  var qt12 = uData.organConfig.qtcs.textareaField_m46c6plr || "";
  var qt13 = uData.organConfig.qtcs.textareaField_m46c6pls || "";
  var qt14 = uData.organConfig.qtcs.tableField_me14n36x || [];
  var qt15 = uData.organConfig.qtcs.tableField_mbyhkwyn || [];
  var qt16 = uData.organConfig.qtcs.tableField_me2fge68 || [];
  var qt17 = uData.organConfig.qtcs.radioField_m96jsjb4 || "";
  var qt18 = uData.organConfig.qtcs.selectField_mec0y6oi === "成本加成定价法" ? 1 : 2;
  var qt19 = uData.organConfig.qtcs.numberField_menzxc5c || 0;
  var qt20 = uData.organConfig.qtcs.tableField_mgka3e9d || []; //复合参数
  var qt25 = uData.organConfig.qtcs.tableField_mo9fep07 || []; //获取每单最低利润子表单
  var qt21 = uData.organConfig.qtcs.selectField_mgka3e9j == "元/轮转" ? 1 : 2; //印刷UV计算方式
  var yh07 = this.$('textField_m96j9pz4').getValue() || qt17;
  this.$('radioField_m96jsjb4').setValue(yh07);
  if (this.$('radioField_m96jsjb4').getValue() == "隐藏") {
    this.setState({ lryc: "HIDDEN" });
  }
  var fplx = qt15.map(function (item) {
    return {
      text: item.textField_me25yvx9,
      value: item.textField_me25yvx9
    };
  });
  this.$("selectField_lfjjy3ge").set("dataSource", fplx);
  var selectedValue = void 0;
  if (event && (typeof event === "undefined" ? "undefined" : _typeof(event)) === 'object' && 'value' in event) {
    selectedValue = event.value;
  } else {
    selectedValue = this.$("selectField_lfjjy3ge").getValue();
  }
  var selectedRow = qt15.find(function (item) {
    return item.textField_me25yvx9 === selectedValue;
  });
  var fp_cb = this.$('numberField_yy43xwb').getValue() || 0;
  var fp_sl = this.$('numberField_mdcme9oy').getValue() || 0;
  if (selectedRow) {
    fp_cb = selectedRow.numberField_mbyhkwyp !== undefined && selectedRow.numberField_mbyhkwyp !== null ? selectedRow.numberField_mbyhkwyp : fp_cb;
    fp_sl = selectedRow.numberField_mbyhsvbn !== undefined && selectedRow.numberField_mbyhsvbn !== null ? selectedRow.numberField_mbyhsvbn : 0;
  }
  if (fp_cb !== this.$('numberField_yy43xwb').getValue()) {
    this.$('numberField_yy43xwb').setValue(fp_cb);
  }
  if (fp_sl !== this.$('numberField_mdcme9oy').getValue()) {
    this.$('numberField_mdcme9oy').setValue(fp_sl);
  }
  var kg_fplx = this.$('selectField_lfjjy3ge').getValue();
  if (!kg_fplx) {
    this.$('selectField_lfjjy3ge').setValue("不开票");
  }

  var kg_sqmq1 = this.$('selectField_mejq1x48').getValue();
  var kg_sqmq = 0;
  if (kg_sqmq1 === "双切") {
    kg_sqmq = 1;
  } else if (kg_sqmq1 === "模切") {
    kg_sqmq = 2;
  }

  var js_lrl = initData.js_lrl || this.$("numberField_lfjjy3gf").getValue() || 0;
  var def_js_lrl = this.$("numberField_m3myrtut").getValue() || zd09 || 0;
  if (def_js_lrl > 0 && (targetId == "textField_lf6e4k3z" || targetId == "selectField_mbh9rxzr")) {
    this.$("numberField_lfjjy3gf").setValue(def_js_lrl, { triggerChange: false });
    js_lrl = def_js_lrl;
    var subNumberData = this.$("tableField_m8wwah53").getValue();
    subNumberData.forEach(function (item) {
      item["numberField_m8wwah55"] = js_lrl;
    });
    this.$("tableField_m8wwah53").setValue(subNumberData, { triggerChange: false });
  }
  if (gg_cbsf > 0) {
    //新增，如果有上浮比例，则利润率按照上浮来算~
    this.$("numberField_lfjjy3gf").setValue(gg_cbsf, { triggerChange: false });
    var _subNumberData = this.$("tableField_m8wwah53").getValue();
    _subNumberData.forEach(function (item) {
      item["numberField_m8wwah55"] = gg_cbsf;
    });
    this.$("tableField_m8wwah53").setValue(_subNumberData, { triggerChange: false });
  }

  if (!gg_gd || !gg_kd || !gg_hd || !gg_sl) {
    return;
  }

  cx04 = kg_sqmq == 1 ? cx04 : 0;
  cx06 = kg_sqmq == 2 ? cx06 : 0;
  cx05 = kg_sqmq == 2 ? cx05 : 0;
  var gg_dymc1 = gg_kd + cx03 + cx04 + cx06;
  var gg_dymc2 = gg_kd + cx09;
  var gg_mcpb1 = INT(qt06 / gg_dymc1);
  var gg_mcpb2 = INT(qt06 / gg_dymc2);
  var gg_mkpb1 = 1; //正面膜宽排版数
  var gg_mkpb2 = 1; //底部膜宽排版数
  var gg_mkpb3 = 1; //背面膜宽排版数
  var gg_lzs1 = 0;
  var gg_lzs2 = 0;
  var gg_lzs3 = 0;
  var gg_fljy = void 0; //放料检验
  if (kg_dbfs == 1) {
    gg_mkpb1 = INT((qt05 - cx02) / (gg_gd * 2 + gg_db + cx01 + cx05));
    gg_lzs1 = INTUP(gg_sl / (gg_mkpb1 * gg_mcpb1)); //正面轮转数
    gg_fljy = "单放料";
  }

  if (kg_dbfs == 2 || kg_dbfs == 3) {
    gg_mkpb1 = INT((qt05 - cx02) / (gg_gd * 2 + cx01 + cx05));
    gg_mkpb2 = INT((qt05 - cx02) / (gg_db + cx07));
    gg_lzs1 = INTUP(gg_sl / (gg_mkpb1 * gg_mcpb1)); //正面轮转数
    gg_lzs2 = INTUP(gg_sl / (gg_mkpb2 * gg_mcpb2)); //底部轮转数
    gg_fljy = "双放料";
  }
  if (kg_dbfs == 4 || kg_dbfs == 5) {
    gg_mkpb1 = INT((qt05 - cx02) / (gg_gd + (cx01 + cx05) / 2));
    gg_mkpb2 = INT((qt05 - cx08) / (gg_db + cx07));
    gg_mkpb3 = INT((qt05 - cx02) / (gg_gd + (cx01 + cx05) / 2));
    gg_lzs1 = INTUP(gg_sl / (gg_mkpb1 * gg_mcpb1)); //正面轮转数
    gg_lzs2 = INTUP(gg_sl / (gg_mkpb2 * gg_mcpb2)); //底部轮转数
    gg_lzs3 = INTUP(gg_sl / (gg_mkpb1 * gg_mcpb1)); //背面轮转数
    gg_fljy = "三放料";
  }
  if (gg_mkpb1 < 1) {
    gg_fljy = "袋型过大";
  }
  var gg_lzs = gg_lzs1 + gg_lzs2 + gg_lzs3;
  this.$("numberField_lw38f7au").setValue(gg_mcpb1);
  this.$("textField_m3mzl5v0").setValue(gg_fljy);
  this.$("numberField_lw38f7at").setValue(gg_mkpb1, { triggerChange: false });
  !isInitData && this.$("numberField_lw38f77r").setValue(gg_lzs1 + gg_lzs3, { triggerChange: false });
  !isInitData && this.$("numberField_mn474rh7").setValue(gg_lzs2, { triggerChange: false });
  if (gg_fljy === "袋型过大") {
    this.utils.dialog({
      method: 'alert',
      title: '规格提示!',
      content: "\u888B\u578B\u5C3A\u5BF8\u8FC7\u5927\uFF0C\u8BF7\u66F4\u6539\u3010\u5E95\u90E8\u65B9\u5F0F\u3011\u6216\u89C4\u683C!"
    });
  }
  var getflsh = function getflsh(gg_lzs) {
    var defaultConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return (Array.isArray(qt14) ? qt14 : []).find(function (r) {
      return gg_lzs > (r.numberField_maavyfhx || 0) && gg_lzs <= (r.numberField_maavyfhy || Infinity);
    }) || defaultConfig;
  };

  var _getflsh = getflsh(gg_lzs),
      _getflsh$numberField_ = _getflsh.numberField_maavyfhz,
      sh01 = _getflsh$numberField_ === undefined ? 0 : _getflsh$numberField_,
      _getflsh$numberField_2 = _getflsh.numberField_maavyfia,
      sh02 = _getflsh$numberField_2 === undefined ? 0 : _getflsh$numberField_2,
      _getflsh$numberField_3 = _getflsh.numberField_maavyfib,
      sh03 = _getflsh$numberField_3 === undefined ? 0 : _getflsh$numberField_3,
      _getflsh$numberField_4 = _getflsh.numberField_maavyfic,
      sh04 = _getflsh$numberField_4 === undefined ? 0 : _getflsh$numberField_4;

  var flsh01 = qt16.find(function (item) {
    return item.selectField_me2fge69 === "自立袋";
  });
  var sh_hs = void 0;
  if (flsh01) {
    if (gg_dymc1 <= 14) {
      sh_hs = flsh01.numberField_me2fge6a;
    } else {
      sh_hs = flsh01.numberField_me2fge6b;
    }
  }

  var getzdlr = function getzdlr(gg_lzs) {
    var defaultConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return (Array.isArray(qt25) ? qt25 : []).find(function (r) {
      return gg_lzs > (r.numberField_mo9fep08 || 0) && gg_lzs <= (r.numberField_mo9fep09 || Infinity);
    }) || defaultConfig;
  };

  var _getzdlr = getzdlr(gg_lzs),
      _getzdlr$numberField_ = _getzdlr.numberField_mo9fep0a,
      qt09_1 = _getzdlr$numberField_ === undefined ? 0 : _getzdlr$numberField_;

  qt09 = qt09_1;
  var kg_sfjd = this.$("selectField_m3sfcjk4").getValue();
  var js_jjf = kg_sfjd === "常规订单" ? 0 : qt11;
  var js_gcjjf = kg_sfjd === "常规订单" ? 0 : dx04;
  var gg_clhd = gg_hd - yc_hd01 - zc1_hd01 - zc2_hd01 - zc3_hd01 - rc_hd01;
  this.$('numberField_m46mzbk9').setValue(gg_clhd);
  this.setState({
    hdjy1: gg_clhd > 0.5 ? "厚度不足,请更改材料" : gg_clhd < -2 ? "厚度过高,请更改材料" : "厚度正常"
  });
  var gg_fl = this.$("textField_m3mzl5v0").getValue() == "单放料" ? 1 : this.$("textField_m3mzl5v0").getValue() == "双放料" ? 2 : 3;
  var js_zl = Math.round((gg_kd * (gg_gd * 2 + gg_db) * (yc_md01 * yc_hd01 + rc_md01 * rc_hd01 + zc1_md01 * zc1_hd01 + zc2_md01 * zc2_hd01 + zc3_md01 * zc3_hd01) / 1000 + gg_kd * zd05 / 100 + gx_xz03 + gx_tqf03 + gx_stk03) * 1000) / 1000;
  var js_zzl = M(gg_sl * js_zl / 1000, 0);
  this.$('numberField_lw4pg0hn').setValue(M(js_zl, 3));
  !isInitData && this.$('numberField_lfjjy3gi').setValue(js_zzl);
  sh04 = kg_sqmq === 2 ? sh04 : 0;
  var sh_cs = (sh01 + (gg_ks <= 1 ? 0 : gg_ks - 1) * sh03) * (1 + sh04 / 100);
  if (gg_fl === 3) {
    sh_cs = (sh02 * 2 + (gg_ks <= 1 ? 0 : gg_ks - 1) * sh03) * (1 + sh04 / 100);
  }
  //复合总共次数
  var fhcs = [yc_mc01, zc1_mc01, zc2_mc01, zc3_mc01, rc_mc01].filter(function (v) {
    return v;
  }).length - 1;
  fhcs = fhcs + "次";
  var getfhcs = qt20.find(function (item) {
    return item.selectField_mgka3e9e == fhcs;
  }); //筛选出对应次数的复合参数
  var fhcs01 = getfhcs ? Number(getfhcs.numberField_mgka3e9f) || 0 : 0; //获取复合开机费
  var fhcs02 = getfhcs ? Number(getfhcs.numberField_mgka3e9g) || 0 : 0; //获取开机费含复合米数
  var fhcs03 = getfhcs ? Number(getfhcs.numberField_mgka3e9h) || 0 : 0; //获取超出复合单价
  var gg_dymk1 = gg_gd * 2 + cx01 + cx05;; //正背面单元膜宽  
  var gg_dymk2 = 0; //底部单元膜宽
  var ysms_cs01_1 = gg_dymk1 * gg_dymc1 * gg_sl / 10000; //彩色印刷平方厘米数
  var ysms_cs01_2 = 0;
  var gg_mlzmc1 = gg_dymc1 * gg_mcpb1;
  var gg_mlzmc2 = gg_dymc2 * gg_mcpb2;
  if (kg_dbfs == 1) {
    //如果底部方式是连底：
    gg_dymk1 = gg_gd * 2 + gg_db + cx01 + cx05;
    ysms_cs01_1 = gg_dymk1 * gg_dymc1 * gg_sl / 10000;
  }
  if (kg_dbfs == 2 || kg_dbfs == 4) {
    //如果贴底印刷：
    gg_dymk1 = gg_gd * 2 + cx01 + cx05;
    gg_dymk2 = gg_dymk2 + cx07;
    ysms_cs01_1 = gg_dymk1 * gg_dymc1 * gg_sl / 10000;
    ysms_cs01_2 = gg_dymk2 * gg_dymc2 * gg_sl / 10000;
  }

  var ysms_cs01 = INTUP(ysms_cs01_1 + ysms_cs01_2); //彩色印刷平方米数
  var ysms_cs02 = INTUP(sh_cs * qt06 * qt04 / 10000); //彩色损耗印刷平方米数
  var ysms_cs = ysms_cs01 + ysms_cs02; //彩色印刷平方米数
  var ysms_hs = INTUP(sh_hs * qt06 * qt04 / 10000); //黑色损耗印刷平方米数

  var js_cl01 = qt04 * gg_mlzmc1 * (sh_hs + gg_lzs + sh_cs); //连底
  var js_cl02 = 0;
  if (kg_dbfs != 1) {

    js_cl01 = qt04 * gg_mlzmc1 * (sh_hs + gg_lzs1 + gg_lzs3 + sh_cs);
    js_cl02 = qt04 * gg_mlzmc2 * gg_lzs2;
  }
  var js_cl = INT((js_cl01 + js_cl02) * (yc_dj01 * yc_md01 * yc_hd01 + rc_dj01 * rc_md01 * rc_hd01 + zc1_dj01 * zc1_md01 * zc1_hd01 + zc2_dj01 * zc2_md01 * zc2_hd01 + zc3_dj01 * zc3_md01 * zc3_hd01) / 1000000 * (1 + qt19 / 100));
  var yslz_cs = sh_cs + gg_lzs;
  if (kg_dbfs == 3 || kg_dbfs == 5) {
    yslz_cs = sh_cs + gg_lzs1 + gg_lzs3;
  }
  var js_ys = (MAX(gx_ys02, yslz_cs * gx_ys01 + sh_hs * qt01) + MAX(gx_uv02, yslz_cs * gx_uv01)) * (1 + qt19 / 100);

  if (qt21 == "2") {
    js_ys = (MAX(gx_ys02, ysms_cs * gx_ys01 + ysms_hs * qt01) + MAX(gx_uv02, ysms_cs * gx_uv01)) * (1 + qt19 / 100);
  }
  var clms = (sh_cs + sh_hs + gg_lzs) * qt06 / 100; //复合米数(材料米数)
  //计算复合价格
  var js_fh = (clms <= fhcs02 ? fhcs01 : fhcs01 + (clms - fhcs02) * fhcs03) * (1 + qt19 / 100);
  zd06 = kg_sqmq === 1 ? zd06 : 0;
  zd07 = kg_sqmq === 2 ? zd07 : 0;
  var zdms = gg_sl * gg_dymc1 / 100;
  zd02 = MAX(zd02, gg_sl / zdms * zd03); //提取最终使用制袋单价
  var js_zd = MAX(zd01, zdms * zd02) + (gg_kd * zd04 / 100 + zd06) * gg_sl + gg_sl * zd07; //制袋+拉链+双切模切价格
  js_zd = js_zd * (1 + qt19 / 100);
  var js_mjf = (kg_sqmq === 2 ? qt02 : 0) * (1 + qt19 / 100);
  var js_qt = (qt00 + MAX(gx_xz02, gx_xz01 * gg_sl) + MAX(gx_stk02, gx_stk01 * gg_sl) + MAX(gx_tqf02, gx_tqf01 * gg_sl) + qt07 * js_zzl + (gg_ks >= 4 ? (gg_ks - 3) * qt08 : 0)) * (1 + qt19 / 100);
  var zl_old = this.$('numberField_lfjjy3gi').getValue() || 0;
  !isInitData && this.$("numberField_lw4pg0hn").setValue(js_zl);
  !isInitData && this.$("numberField_lfjjy3gi").setValue(js_zzl);
  var yf_xz = this.$('numberField_m3ns67kq').getValue() || 0;
  var yf_qz = this.$('numberField_m3ns67kp').getValue() || 0;
  var js_yf = 0;
  if (isInitData && initData.targetId != 'numberField_m949d9zc') {
    js_yf = initData.js_yf || 0;
  } else {
    if (targetId === "numberField_m3ns67kq" || zl_old != js_zzl) {
      js_yf = (js_zzl - 1) * yf_xz + yf_qz;
    } else {
      js_yf = !isInitData && this.$("numberField_m3ns67jg").getValue() || M((js_zzl - 1) * yf_xz + yf_qz, 0);
    }
  }
  var js_yfIsChange = false;
  if (!isInitData) {
    var old_js_yf = this.$("numberField_m3ns67jg").getValue() || 0;
    js_yfIsChange = old_js_yf != js_yf;
    this.$("numberField_m3ns67jg").setValue(js_yf, { triggerChange: false });
  }
  var js_cb = js_cl + js_fh + js_mjf + js_qt + js_ys + js_zd;
  var js_cb01 = Number((js_cb / gg_sl).toFixed(3));
  var js_zcb = js_cb + js_gcjjf + js_jjf + js_yf;
  var js_zcb01 = Number((js_zcb / gg_sl).toFixed(3));
  var cl_hd = parseFloat(((+yc_hd01 || 0) + (+zc1_hd01 || 0) + (+zc2_hd01 || 0) + (+zc3_hd01 || 0) + (+rc_hd01 || 0)).toFixed(1));
  var checkingMsg = [];
  if (!this.$("selectField_mbh9rxzr").getValue()) checkingMsg.push('"拉链类型"');
  if (!this.$("numberField_lw38f76z").getValue()) checkingMsg.push('"宽度"');
  if (!this.$("numberField_lw38f785").getValue()) checkingMsg.push('"高度"');
  if (!this.$("numberField_lw38f786").getValue()) checkingMsg.push('"单面厚度"');
  if (!this.$("numberField_lw38f787").getValue()) checkingMsg.push('"数量"');
  if (!this.$("selectField_mb98893i").getValue()) checkingMsg.push('"印刷层"');
  if (!this.$("selectField_mb98893m").getValue()) checkingMsg.push('"热封层"');
  if (!this.$("selectField_mbg8tmyt").getValue()) checkingMsg.push('"印刷方式"');
  if (!this.$("selectField_m3sfcjk4").getValue()) checkingMsg.push('"是否急单"');
  if (!this.$("selectField_lfjjy3ge").getValue()) checkingMsg.push('"发票类型"');
  if (checkingMsg.length > 0) {
    if (!isInitData) {
      this.$('numberField_lw38f7a0').setValue(0);
      this.$('numberField_lw38f7a2').setValue(0);
      this.$('numberField_lw38f7a4').setValue(0);
      this.$('numberField_lw38f7a8').setValue(0);
      this.$('numberField_m3ns67je').setValue(0);
      this.$('numberField_m3p7r7aq').setValue(0);
      this.$('numberField_m3p7r7ao').setValue(0);
      this.$('numberField_m3p7r7ap').setValue(0);
      this.$('numberField_lw38f7ac').setValue(0);
      this.$('numberField_lw38f7aa').setValue(0);
    }
  } else {
    if (!isInitData) {
      this.$('numberField_lw38f7a0').setValue(js_cl);
      this.$('numberField_lw38f7a2').setValue(js_ys);
      this.$('numberField_lw38f7a4').setValue(js_fh);
      this.$('numberField_lw38f7a8').setValue(js_zd);
      this.$('numberField_m3ns67je').setValue(js_mjf);
      this.$('numberField_m3p7r7aq').setValue(js_qt);
      this.$('numberField_m3p7r7ao').setValue(js_cb);
      this.$('numberField_m3p7r7ap').setValue(js_cb01);
      this.$('numberField_lw38f7ac').setValue(js_zcb);
      this.$('numberField_lw38f7aa').setValue(js_zcb01);
    }
  }
  function getjs_chrq(daysToAdd) {
    var date = new Date();
    date.setDate(date.getDate() + Number(daysToAdd));
    return date.toISOString().split('T')[0];
  }
  var js_chts = kg_sfjd === "常规订单" ? dx02 : dx03;
  var js_chrq = kg_sfjd === "常规订单" ? getjs_chrq(dx02) : getjs_chrq(dx03);
  this.$('dateField_m3sfcjkd').setValue(js_chrq);

  var bj01 = qt18 == "1" ? MAX(js_zcb + qt09, js_zcb * (1 + js_lrl / 100)) : MAX(js_zcb + qt09, js_zcb / (1 - js_lrl / 100));
  var bj02 = bj01 * fp_cb / 100;
  var bj03 = bj01 + bj02;
  var xsd = initData.xsd || this.$("selectField_m96a7n59").getValue();
  var bj04 = M(bj03 / gg_sl, xsd);
  var bj05 = M(bj04 * gg_sl, 0);
  var js_hszcb = js_zcb + bj05 * fp_cb / 100;
  var js_dgcb = M(js_hszcb / gg_sl, 3);
  !isInitData && this.$('numberField_m52dv28t').setValue(js_hszcb);
  !isInitData && this.$('numberField_mepfn6zh').setValue(js_dgcb);
  var bj06 = bj05 - js_hszcb;
  !isInitData && this.$('numberField_m3prx1x4').setValue(bj02);
  !isInitData && this.$('textField_meo2tno9').setValue(bj04);
  !isInitData && this.$('numberField_m3ns67ks').setValue(bj05);
  !isInitData && this.$('numberField_m5ndstg9').setValue(bj06);
  var cl_ysc = yc_mc01 == "" ? "" : yc_mc01 + "/";
  var cl_zgc1 = zc1_mc01 == "" ? "" : zc1_mc01 + "/";
  var cl_zgc2 = zc2_mc01 == "" ? "" : zc2_mc01 + "/";
  var cl_zgc3 = zc3_mc01 == "" ? "" : zc3_mc01 + "/";
  var cl_rfc = rc_mc01 == "" ? "" : "" + rc_mc01;
  var qt_uv = gx_uv07 == "" ? "" : "," + gx_uv07;
  var qt_xz = gx_xz07 == "" ? "" : "" + gx_xz07;
  var qt_stk = gx_stk07 == "" ? "" : "" + gx_stk07;
  var qt_tqf = gx_tqf07 == "" ? "" : "" + gx_tqf07;
  var qt_gx = "\u5176\u4ED6\u5DE5\u5E8F:" + qt_xz + qt_stk + qt_tqf;
  var ch_yjch = js_chrq.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1年$2月$3日');
  var xx01 = qt12;
  var xx02 = "\u54C1\u540D:" + this.$("textField_lf6e4k38").getValue();
  var xx03 = "\u888B\u578B:" + zd08;
  if (kg_sqmq1 == "模切") {
    xx03 = "\u888B\u578B:" + zd08 + "-\u5F02\u578B";
  }
  var xx04 = "\u89C4\u683C:\u5BBD\u5EA6" + gg_kd + "cm,\u9AD8\u5EA6" + gg_gd + "cm,\u5C55\u5F00\u5E95" + gg_db + "cm";
  var xx05 = "\u6750\u6599:" + cl_ysc + cl_zgc1 + cl_zgc2 + cl_zgc3 + cl_rfc + ",\u5355\u9762" + cl_hd + "\u4E1D";
  var xx06 = "\u5370\u5237:" + gx_ys07 + qt_uv;
  var xx07 = "\u6570\u91CF:" + gg_sl + "\u4E2A(" + gg_ks + "\u6B3E*" + (gg_sl / gg_ks | 0) + "\u4E2A)";
  var xx08 = "\u603B\u4EF7:" + bj05 + "\u5143,\u5355\u4EF7: " + bj04 + "\u5143/\u4E2A";
  var xx09 = void 0;
  if (!qt_xz && !qt_stk && !qt_tqf) {
    xx09 = "";
  } else {
    var parts = [];
    if (qt_xz) {
      parts.push(qt_xz);
    }
    if (qt_stk) {
      parts.push(qt_stk);
    }
    if (qt_tqf) {
      parts.push(qt_tqf);
    }
    if (parts.length > 0) {
      xx09 = "其他:" + parts.join(',') + '\n';
    }
  }
  var xx10 = "\u9884\u8BA1\u51FA\u8D27:" + kg_sfjd + ",\u4ECA\u5929\u786E\u5B9A\u6392\u7248\u56FE,\u9884\u8BA1" + ch_yjch + "\u53D1\u8D27(" + js_chts + "\u5929)";
  var xx11 = xx03 + "\n" + xx04 + "\n" + xx05 + "\n" + xx06 + "\n" + xx09 + xx07;
  var xx12 = "\u5907\u6CE8:\u62A5\u4EF7" + (kg_fplx.includes("不") ? "\u4E0D\u542B\u7A0E" : "\u542B\u7A0E(" + fp_sl + " %)") + "," + (js_yf >= 1 ? "含运" : "不含运") + ",\u603B\u91CD\u91CF\u7EA6:" + js_zzl + "Kg";
  this.$('textareaField_m1yh7scn').setValue(xx11);
  this.$('textField_mbyivrdb').setValue(xx12);
  var spec = xx01 + "\n" + xx02 + "\n" + xx03 + "\n" + xx04 + "\n" + xx05 + "\n" + xx06 + "\n" + xx07 + "\n" + xx08 + "\n" + xx09 + xx12 + "\n" + qt13;
  var valueData = this.$("tableField_m8wwah53").getValue();
  if (!isInitData && valueData.filter(function (item) {
    return item.numberField_m949d9zc > 0;
  }).length) {
    this.subNumberChange({
      extra: {
        fieldId: js_yfIsChange ? 'numberField_m949d9zc' : ''
      }
    });
  }
  return {
    bj01: bj01, bj02: bj02, bj03: bj03, bj04: bj04, bj05: bj05, bj06: bj06, js_zzl: js_zzl, js_lrl: js_lrl, spec: spec, checkingMsg: checkingMsg, js_yf: js_yf, xsd: xsd, js_hszcb: js_hszcb
  };
}