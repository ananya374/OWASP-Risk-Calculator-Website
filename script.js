let riskChart;

function calc_score() {
  const getValue = (id) => parseInt(document.getElementById(id).value) || 0;

  const threat = ['sl', 'motive', 'oppor', 'size'];
  const vuln = ['eod', 'eoe', 'awareness', 'intrusion'];
  const tech = ['loc', 'loi', 'loa', 'loac'];
  const biz = ['fin', 'rep', 'non', 'priv'];

  const getAverage = (ids) => ids.map(getValue).reduce((a, b) => a + b, 0) / ids.length;

  let likelihood = getAverage([...threat, ...vuln]).toFixed(2);
  let impact = getAverage([...tech, ...biz]).toFixed(2);
  let risk = (likelihood * impact).toFixed(2);

  document.getElementById("like_score").textContent = likelihood;
  document.getElementById("impact_score").textContent = impact;
  const riskEl = document.getElementById("risk_score");
  riskEl.textContent = risk;
  riskEl.style.fontWeight = "bold";

  let color = "green";
  if (risk < 10) color = "green";
  else if (risk < 30) color = "orange";
  else color = "red";
  riskEl.style.color = color;

  const data = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [{
      label: 'Risk Level',
      data: [
        risk < 10 ? risk : 0,
        (risk >= 10 && risk < 30) ? risk : 0,
        risk >= 30 ? risk : 0
      ],
      backgroundColor: ['green', 'orange', 'red']
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, suggestedMax: 100 }
      },
      plugins: { legend: { display: false } }
    }
  };

  if (riskChart) riskChart.destroy();
  const ctx = document.getElementById('riskChart').getContext('2d');
  riskChart = new Chart(ctx, config);
}

window.addEventListener('DOMContentLoaded', calc_score);
document.querySelectorAll("input").forEach(inp => inp.addEventListener("input", calc_score));

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const getVal = (id) => document.getElementById(id).value;

  const likelihood = document.getElementById("like_score").textContent;
  const impact = document.getElementById("impact_score").textContent;
  const risk = document.getElementById("risk_score").textContent;

  let riskText = "";
  if (risk < 10) riskText = "Low Risk – Looks good.";
  else if (risk < 30) riskText = "Medium Risk – Needs attention.";
  else riskText = "High Risk – Critical issue!";

  doc.setFontSize(18);
  doc.setTextColor(21, 101, 192);
  doc.text("OWASP Risk Assessment Report", 20, 20);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Likelihood Score: ${likelihood}`, 20, 35);
  doc.text(`Impact Score: ${impact}`, 20, 43);
  doc.text(`Final Risk Score: ${risk}`, 20, 51);
  doc.text(`Risk Evaluation: ${riskText}`, 20, 59); // No emojis here

  doc.text("Threat Agent Factors:", 20, 70);
  doc.text(`- Skill Level: ${getVal('sl')}`, 25, 78);
  doc.text(`- Motive: ${getVal('motive')}`, 25, 86);
  doc.text(`- Opportunity: ${getVal('oppor')}`, 25, 94);
  doc.text(`- Size: ${getVal('size')}`, 25, 102);

  doc.text("Vulnerability Factors:", 20, 114);
  doc.text(`- Ease of Discovery: ${getVal('eod')}`, 25, 122);
  doc.text(`- Ease of Exploit: ${getVal('eoe')}`, 25, 130);
  doc.text(`- Awareness: ${getVal('awareness')}`, 25, 138);
  doc.text(`- Intrusion Detection: ${getVal('intrusion')}`, 25, 146);

  doc.text("Technical Impact Factors:", 20, 158);
  doc.text(`- Loss of Confidentiality: ${getVal('loc')}`, 25, 166);
  doc.text(`- Loss of Integrity: ${getVal('loi')}`, 25, 174);
  doc.text(`- Loss of Availability: ${getVal('loa')}`, 25, 182);
  doc.text(`- Loss of Accountability: ${getVal('loac')}`, 25, 190);

  doc.text("Business Impact Factors:", 20, 202);
  doc.text(`- Financial Damage: ${getVal('fin')}`, 25, 210);
  doc.text(`- Reputation Damage: ${getVal('rep')}`, 25, 218);
  doc.text(`- Non-compliance: ${getVal('non')}`, 25, 226);
  doc.text(`- Privacy Violation: ${getVal('priv')}`, 25, 234);

  doc.text("Made by Ananya Arora", 20, 250); // No emoji

  doc.save("OWASP_Risk_Report.pdf");
}
