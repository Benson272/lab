window.onload = (event) => {
  const form = document.getElementById('form')
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const [csvValues, labelName] = processForm(form)
    const fileBlob = makeTextFile(csvValues)
    const downloadLink = document.getElementById('csvLink')
    downloadLink.href = fileBlob;
    downloadLink.download = labelName;
    downloadLink.innerText = `${labelName}.csv`;
  });
};


var textFile = null;
const makeTextFile = function (text) {
  var data = new Blob([text], {type: 'text/csv'});

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  // returns a URL you can use as a href
  return textFile;
};


//processes a form and converts it to a csv string
const processForm = (form) => {
  const formData = new FormData(form);
  const labelName = formData.get('labelName');
  const sectionsPerSlide = formData.get('sectionsPerSlide');
  const unstainedBlock = formData.get('unstainedBlock') || '0';
  const heBlock = formData.get('heBlock') || '0';
  const sampleList = formData.get('sampleList').split(", ");


  let sampleListA = []
  let sampleListB = []
  sampleList.forEach(sample => {
    if (sample.length > 10) {
      sampleListA.push(sample.slice(0,10).trim())
      sampleListB.push(sample.slice(10).trim())
    } else {
      sampleListA.push(sample.trim());
      sampleListB.push('')
    }
  });

  console.log(labelName, sectionsPerSlide, unstainedBlock, heBlock, sampleListA, sampleListB)

  let csv = 'Label1, Label2, Label3, Text1, total # of slides, # of sections per slide\n';

  sampleListA.forEach((sampleName, idx) => {
    const label1 = sampleName;
    const label2 = sampleListB[idx];
    const label3 = labelName;
    const numSectionPerSlide = sectionsPerSlide;

    let text1;
    let totalNumSlide;
    if (Number(heBlock) > 0) {
      text1 = 'H&E';
      totalNumSlide = heBlock
      csv += `${label1}, ${label2}, ${label3}, ${text1}, ${totalNumSlide}, ${numSectionPerSlide} \n`;
    }
    if (Number(unstainedBlock) > 0) {
      text1 = 'Unstained';
      totalNumSlide = unstainedBlock
      csv += `${label1}, ${label2}, ${label3}, ${text1}, ${totalNumSlide}, ${numSectionPerSlide} \n`;
    }
  })

  return [csv, labelName]
}
