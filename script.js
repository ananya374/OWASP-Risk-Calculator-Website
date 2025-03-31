function calc_score() {
    // Retrieve values and ensure they are parsed as integers
    const getValue = (id) => parseInt(document.getElementById(id).value) || 0;

    // Calculate Likelihood Score (Threat Agent + Vulnerability Factors)
    let likelihood = (
        (getValue('sl') + getValue('motive') + getValue('oppor') + getValue('size') +
         getValue('eod') + getValue('eoe') + getValue('awareness') + getValue('intrusion')) / 8
    ).toFixed(2);

    // Calculate Impact Score (Technical + Business Impact Factors)
    let impact = (
        (getValue('loc') + getValue('loi') + getValue('loa') + getValue('loac') +
         getValue('finan') + getValue('rep') + getValue('non') + getValue('priv')) / 8
    ).toFixed(2);

    // Calculate Risk Score
    let risk = (likelihood * impact).toFixed(2);

    // Update the UI dynamically
    document.getElementById("like_score").textContent = likelihood;
    document.getElementById("impact_score").textContent = impact;
    document.getElementById("risk_score").textContent = risk;

    // Apply color-coding based on risk level
    let riskElement = document.getElementById("risk_score");
    riskElement.style.fontWeight = "bold";
    
    if (risk < 10) {
        riskElement.style.color = "green";  // Low risk
    } else if (risk >= 10 && risk < 30) {
        riskElement.style.color = "orange";  // Medium risk
    } else {
        riskElement.style.color = "red";  // High risk
    }
}
