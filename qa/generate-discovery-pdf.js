const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

async function generateDiscoveryReport(testResults) {
    const doc = new PDFDocument();
    const reportPath = path.join(__dirname, "reports", "product-discovery-report.pdf");
    
    if (!fs.existsSync(path.join(__dirname, "reports"))) {
        fs.mkdirSync(path.join(__dirname, "reports"));
    }

    const output = fs.createWriteStream(reportPath);
    doc.pipe(output);

    doc.fontSize(25).text("Product Discovery Flow Test Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${new Date().toLocaleString()}`);
    doc.text("Application: Malstro App");
    doc.text("Testing Type: End-to-End (E2E)");
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc.fontSize(18).text("Test Summary", { underline: true });
    doc.moveDown(0.5);

    const total = testResults.length;
    const passed = testResults.filter(r => r.status === "passed").length;
    const failed = total - passed;

    doc.fontSize(12).text(`Total Test Cases: ${total}`, { indent: 20 });
    doc.fontSize(12).text(`Passed: ${passed}`, { indent: 20, color: "green" });
    doc.fillColor("black");
    doc.fontSize(12).text(`Failed: ${failed}`, { indent: 20, color: failed > 0 ? "red" : "black" });
    doc.fillColor("black");
    doc.moveDown();
    doc.fontSize(18).text("Detailed Results", { underline: true });
    doc.moveDown(0.5);

    if (testResults.length === 0) {
        doc.fontSize(12).text("No test results found for Product Discovery Flow.", { indent: 20 });
    }

    testResults.forEach((result, index) => {
        doc.fontSize(14).text(`${index + 1}. ${result.title}`, { bold: true });
        doc.fontSize(12).text(`Status: ${result.status.toUpperCase()}`, { 
            indent: 20, 
            color: result.status === "passed" ? "green" : "red" 
        });
        doc.fillColor("black");
        if (result.error) {
            doc.fontSize(10).text(`Error: ${result.error}`, { indent: 20, color: "red" });
            doc.fillColor("black");
        }
        doc.moveDown(0.5);
    });

    doc.end();
    console.log(`Report generated at: ${reportPath}`);
}

function findDiscoverySpecs(suites, results = []) {
    suites.forEach(suite => {
        if (suite.title === "Product Discovery Flow") {
            collectSpecs(suite, results);
        } else if (suite.suites) {
            findDiscoverySpecs(suite.suites, results);
        }
    });
    return results;
}

function collectSpecs(suite, results) {
    if (suite.specs) {
        suite.specs.forEach(spec => {
            spec.tests.forEach(test => {
                results.push({
                    title: spec.title,
                    status: test.results[0]?.status || "unknown",
                    error: test.results[0]?.error?.message
                });
            });
        });
    }
    if (suite.suites) {
        suite.suites.forEach(s => collectSpecs(s, results));
    }
}

const playwrightJsonPath = path.join(__dirname, "..", "app", "playwright-report", "discovery_results.json");
if (fs.existsSync(playwrightJsonPath)) {
    let content = fs.readFileSync(playwrightJsonPath, "utf8");
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    content = content.replace(/\u0000/g, ""); 
    
    try {
        const data = JSON.parse(content);
        const discoveryResults = findDiscoverySpecs(data.suites);
        generateDiscoveryReport(discoveryResults);
    } catch (err) {
        console.error("Error parsing JSON:", err.message);
    }
} else {
    console.error("Playwright results.json not found.");
}