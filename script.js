const width = 800;
const height = 400;
const stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
});
const layer = new Konva.Layer();
stage.add(layer);

let keyboard = {
  rows: []
};

let rowCount = 0;
let selectedKey = null;

const predefinedConfigs = {
  leo: { lines: 5, keysPerLine: 7 },
  kwisatz: { lines: 4, keysPerLine: 5 },
};

function loadPredefinedConfig(configName) {
  layer.removeChildren();
  keyboard.rows = [];
  rowCount = 0;

  const config = predefinedConfigs[configName];
  if (config) {
    for (let i = 0; i < config.lines; i++) {
      addRow(config.keysPerLine);
    }
  }
}

document.getElementById('configSelect').addEventListener('change', function () {
  const selectedConfig = this.value;
  if (selectedConfig) {
    loadPredefinedConfig(selectedConfig);
  }
});

document.getElementById('addRowBtn').addEventListener('click', () => {
  const keyCount = prompt("Combien de touches voulez-vous ajouter dans cette ligne ?");
  if (keyCount) {
    addRow(parseInt(keyCount));
  }
});

function addRow(keyCount) {
  rowCount++;
  const rowY = rowCount * 70;

  const newRow = {
    rowNumber: rowCount,
    keys: []
  };
  keyboard.rows.push(newRow);

  for (let i = 0; i < keyCount; i++) {
    const key = new Konva.Rect({
      x: i * 120 + 10,
      y: rowY,
      width: 100,
      height: 50,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 0, y: 50 },
      fillLinearGradientColorStops: [0, '#e0e0e0', 1, '#a0a0a0'],
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowBlur: 10,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
      shadowOpacity: 0.5,
      cornerRadius: 10,
      stroke: '#777',
      strokeWidth: 2,
    });

    const keyData = {
      type: '',
      productFunction: '',
      color: 'lightgray',
      x: key.x(),
      y: key.y(),
      width: key.width(),
      height: key.height(),
    };

    key.index = newRow.keys.length;
    newRow.keys.push(keyData);

    key.on('mouseenter', () => {
      key.shadowOffsetX(10);
      key.shadowOffsetY(10);
      key.fillLinearGradientColorStops([0, '#cccccc', 1, '#888888']);
      layer.draw();
    });

    key.on('mouseleave', () => {
      key.shadowOffsetX(5);
      key.shadowOffsetY(5);
      key.fillLinearGradientColorStops([0, '#e0e0e0', 1, '#a0a0a0']);
      layer.draw();
    });

    key.on('click', () => {
      selectedKey = key;
      openConfigModal();
    });

    layer.add(key);
  }

  layer.draw();
}

function openConfigModal() {
  const modal = document.getElementById("configModal");
  modal.classList.remove("hidden");
}

function closeConfigModal() {
  const modal = document.getElementById("configModal");
  modal.classList.add("hidden");
}

function resetModal() {
  document.getElementById("type").value = "product";
  document.getElementById("productFunction").value = "";
  document.getElementById("color").value = "#ffffff";
}

document.getElementById("saveConfigBtn").addEventListener("click", () => {
  const type = document.getElementById("type").value;
  const productFunction = document.getElementById("productFunction").value;
  const color = document.getElementById("color").value;

  if (selectedKey) {
    selectedKey.fill(color);

    const rowIndex = keyboard.rows.findIndex(row =>
      row.keys.some(key => key.x === selectedKey.x() && key.y === selectedKey.y())
    );

    if (rowIndex !== -1) {
      const keyData = keyboard.rows[rowIndex].keys.find(key =>
        key.x === selectedKey.x() && key.y === selectedKey.y()
      );

      keyData.type = type;
      keyData.productFunction = productFunction;
      keyData.color = color;

      const productFunctionText = new Konva.Text({
        x: selectedKey.x(),
        y: selectedKey.y() + 15,
        width: selectedKey.width(),
        text: productFunction,
        fontSize: 16,
        fontFamily: 'Calibri',
        fill: 'black',
        align: 'center'
      });

      layer.add(productFunctionText);
      layer.draw();
    }
  }

  closeConfigModal();
  resetModal();
});

document.getElementById('closeModal').addEventListener('click', closeConfigModal);

document.getElementById('exportBtn').addEventListener('click', () => {
  const json = JSON.stringify(keyboard, null, 2);
  document.getElementById('jsonOutput').value = json;
});
