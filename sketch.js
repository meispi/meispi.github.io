class Complex
{
  constructor(a,b)
  {
    this.re = a;
    this.im = b;
  }
}

let x = [];
let fourierX;
let time = 0;
let path = [];

function setup() {
  createCanvas(1500, 1000);
  const skip = 8;
  for (let i = 0; i < drawing.length; i += skip) {
    const c = new Complex(drawing[i].x,drawing[i].y);
    x.push(c);
  }
  fourierX = dft(x);
  console.log(fourierX);
  fourierX.sort((a, b) => b.amp - a.amp);
  frameRate(20);
}

function epiCycles(x, y, rotation, fourier) {
  for (let i = 0; i < fourier.length ; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;
    x += radius * cos(freq * time + phase + rotation);
    y -= radius * sin(freq * time + phase + rotation);

    if(i > 0)
    {
      stroke(255);
      noFill();
      ellipse(prevx, prevy, radius * 2);
      stroke(255);
      line(prevx, prevy, x, y);
    }
    
  }
  return createVector(x, y);
}

function draw() {
  background(0);

  let v = epiCycles(width / 3 -200, height / 3 -300, 0, fourierX);
  path.unshift(v);

  beginShape();
  noFill();
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].x, path[i].y);
  }
  endShape();

  const dt = TWO_PI / fourierX.length ;
  time += dt;

  /*if (time >= TWO_PI + 0.5) {
    time = 0;
    path = [];
  }*/

}

function dft(x) {
    const X = [];
    const N = x.length;
    for (let k = 0; k < N; k++) {
      let sum = new Complex(0,0);
      for (let n = 0; n < N; n++) {
        const phi = (TWO_PI * k * n) / N;
        sum.re += x[n].re * cos(phi) + x[n].im * sin(phi);
        sum.im -= -x[n].re * sin(phi) + x[n].im * cos(phi);
      }
      sum.re = sum.re / N;
      sum.im = sum.im / N;
  
      let freq = k;
      let amp = sqrt(sum.re * sum.re + sum.im * sum.im);
      let phase = atan2(sum.im, sum.re);
      X[k] = { re: sum.re, im: sum.im, freq, amp, phase };
    }
    return X;
  }
