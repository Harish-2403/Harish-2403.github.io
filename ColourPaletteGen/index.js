const container = document.querySelector(".container");
const refreshBtn = document.querySelector(".refresh-btn");

const maxPaletteBoxes = 5;

var rotation = 45,
  baseColor,
  secondColor,
  thirdColor,
  fourthColor,
  fifthColor,
  lightBackground;

// Color class for generating colors
var Color = function (hue, sat, light) {
  // Settings for color generation
  this.minHue = 0;
  this.maxHue = 360;

  this.minSat = 75;
  this.maxSat = 100;

  this.minLight = 65;
  this.maxLight = 80;

  this.scaleLight = 15;

  // Darker colors for a light background
  if (lightBackground) {
    this.minLight = 40;
    this.maxLight = 65;
  }

  // Set hue
  this.hue = hue || randomNum(this.minHue, this.maxHue);

  this.sat = sat || randomNum(this.minSat, this.maxSat);
  
  this.light = light || randomNum(this.minLight, this.maxLight);

  this.hsl = "hsl(" + this.hue + ", " + this.sat + "%, " + this.light + "%)";
};

// Functions to change hue and lightness within limits
Color.prototype.changeHue = function (hue, rotate) {
  return hue + rotate > this.maxHue ? hue + rotate - this.maxHue : hue + rotate;
};

Color.prototype.changeLight = function (light) {
  return light + this.scaleLight > this.maxLight
    ? this.maxLight
    : light + this.scaleLight;
};

var randomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var lightBackground = false;

// Set three main colors of the palette
var setColors = function (newPalette) {
  if (newPalette) {
    baseColor = new Color();
  }

  secondColor = new Color(
    baseColor.changeHue(baseColor.hue, rotation),
    baseColor.sat,
    baseColor.changeLight(baseColor.light)
  );

  thirdColor = new Color(
    baseColor.changeHue(baseColor.hue, rotation + rotation),
    baseColor.sat,
    baseColor.changeLight(baseColor.light)
  );

  fourthColor = new Color(
    baseColor.changeHue(baseColor.hue, rotation + rotation + rotation),
    baseColor.sat,
    baseColor.changeLight(baseColor.light)
  );

  fifthColor = new Color(
    baseColor.changeHue(
      baseColor.hue,
      rotation + rotation + rotation + rotation
    ),
    baseColor.sat,
    baseColor.changeLight(baseColor.light)
  );
};

const generatePalette = () => {
  container.innerHTML = ""; // clearing the container
  setColors(true);

  for (let i = 0; i < maxPaletteBoxes; i++) {
    // creating a new 'div' element for each color box
    const color = document.createElement("li");
    color.classList.add("color");

    // Using Color class to generate color instead of random hex
    const currentColor =
      i === 0
        ? baseColor
        : i === 1
        ? secondColor
        : i === 2
        ? thirdColor
        : i === 3
        ? fourthColor
        : fifthColor;

    color.innerHTML = `<div class="rect-box" style="background: ${currentColor.hsl}"></div>
    <span class="hex-value">${currentColor.hsl}</span>`;

    // adding click event to current li element to copy the color
    color.addEventListener("click", () => copyColor(color, currentColor.hsl));
    container.appendChild(color);
  }
};
var rgbToHex = function (rgb) {
  var hex = [];

  for (var i = 0; i < rgb.length - 1; i++) {
    hex[i] = rgb[i].toString(16);

    if (hex[i].length < 2) {
      hex[i] = "0" + hex[i]; // Pad with leading zero
    }
  }

  return "#" + hex.join("");
};

const copyColor = (elem, hexVal) => {
  const colorElement = elem.querySelector(".hex-value");
  // Copying the hex value, updating the text to copied,
  // and changing text back to original hex value after 1 second
  navigator.clipboard
    .writeText(hexVal)
    .then(() => {
      colorElement.innerText = "Copied";
      setTimeout(() => (colorElement.innerText = hexVal), 1000);
    })
    .catch(() => alert("Failed to copy the color code!")); // showing alert if color can't be copied
};

refreshBtn.addEventListener("click", generatePalette);

// Initial palette generation
generatePalette();
