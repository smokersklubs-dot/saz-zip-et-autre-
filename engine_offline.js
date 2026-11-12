const fs = require('fs');

// Charger les bases de données extraites
const db = JSON.parse(fs.readFileSync('C:/Users/stick/.gemini/antigravity/scratch/miaobaojia/databases_clean.json', 'utf8'));

// Simuler l'objet uData
const uData = {
  utils: {
    Sum: function Sum(val) {
      return (val || []).reduce(function (p, n) { return p + n; }, 0);
    },
    Max: function Max(...args) {
      const valArr = args.map(arg => (Number.isNaN(arg) || arg === undefined || arg === null) ? 0 : Number(arg));
      return Math.max(...valArr);
    },
    Int: function Int(val) {
      return parseInt(val || "0", 10);
    },
    Fixed: function Fixed(val, f) {
      return parseFloat(Number(val).toFixed(f));
    },
    getPickerData: function getPickerData(conf) {
      const findItem = (conf.arr || []).find(item => {
        return (conf.val && item.formData && item.formData[conf.key] == conf.val) || (item.formInstId == conf.instanceId);
      });
      return findItem ? findItem.formData : {};
    }
  },
  organConfig: {
    dxcs: db.dxcs.data,
    clk: db.clk.data,
    gxcb: db.gxcb.data,
    qtcs: db.qtcs.data[0].formData
  }
};

// Charger le code brut de suanfa
const suanfaCode = fs.readFileSync('C:/Users/stick/.gemini/antigravity/scratch/miaobaojia/suanfa.js', 'utf8');

function calculateQuote(inputs) {
  const store = Object.assign({}, inputs);
  const outputs = {};

  const mockThis = {
    params: {},
    state: {
      dxcs: db.dxcs.data,
      clk: db.clk.data,
      gxcb: db.gxcb.data,
      qtcs: db.qtcs.data[0].formData,
      ggdw: 'mm',
      hddw: '丝',
      lryc: 'HIDDEN'
    },
    setState: function(newState) {
      Object.assign(this.state, newState);
    },
    $: function(id) {
      return {
        getValue: function() {
          return store[id];
        },
        setValue: function(val) {
          store[id] = val;
          outputs[id] = val;
        },
        set: function(prop, val) {
          return this;
        },
        get: function(prop) {
          return null;
        }
      };
    }
  };

  const fn = new Function('uData', `
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    return function(event, target) {
      ${suanfaCode}
      return suanfa.call(this, event, target);
    }
  `)(uData);

  fn.call(mockThis, {}, {});

  return {
    inputs: store,
    outputs: outputs,
    summary: {
      largeur_mm: store['numberField_lw38f76z'],
      hauteur_mm: store['numberField_lw38f785'],
      fond_mm: store['numberField_m3pstfde'],
      quantite: store['numberField_lw38f787'],
      poids_unitaire_g: outputs['numberField_lw4pg0hn'] !== undefined ? outputs['numberField_lw4pg0hn'] : store['numberField_lw4pg0hn'],
      poids_total_kg: outputs['numberField_lfjjy3gi'] !== undefined ? outputs['numberField_lfjjy3gi'] : store['numberField_lfjjy3gi'],
      prix_unitaire_vente_cny: outputs['textField_meo2tno9'] !== undefined ? outputs['textField_meo2tno9'] : store['textField_meo2tno9'],
      prix_total_vente_cny: outputs['numberField_m3ns67ks'] !== undefined ? outputs['numberField_m3ns67ks'] : store['numberField_m3ns67ks'],
      cout_unitaire_reel_cny: outputs['numberField_mepfn6zh'] !== undefined ? outputs['numberField_mepfn6zh'] : store['numberField_mepfn6zh'],
      cout_total_reel_cny: outputs['numberField_m52dv28t'] !== undefined ? outputs['numberField_m52dv28t'] : store['numberField_m52dv28t'],
      marge_pct: outputs['numberField_lfjjy3gf'] !== undefined ? outputs['numberField_lfjjy3gf'] : store['numberField_lfjjy3gf'],
      profit_total_cny: outputs['numberField_m5ndstg9'] !== undefined ? outputs['numberField_m5ndstg9'] : store['numberField_m5ndstg9']
    }
  };
}

module.exports = { calculateQuote, db };
