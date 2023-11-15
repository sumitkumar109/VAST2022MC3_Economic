
var globalExpenseDataset = []
var globalData = []
var educationLevelList = []
var ageGroupList = []
var categoryList = []
var margin = { top: 10, bottom: 30, left: 50, right: 50 }
var width
var height
var chartHeight
var chartWidth
var pieData = []
var colors
var colorCodes = ["#F22B67", "#F69402", "#F1DF01", "#50E600", "#02A4ED"]
// "#7E25D7", "#00798D"

document.addEventListener("DOMContentLoaded", function () {
    var svg = d3.select("#vanshaj");
    var textarea = document.getElementById("vanshaj_description");
    textarea.value = "vanshaj";

    Promise.all([d3.csv('datasets/ExpenseDataset.csv')])
        .then(function (data) {
            globalData = data[0]
            globalExpenseDataset = globalData.map(d => {

                return {
                    "ParticipantId": d.participantId,
                    "TimeStamp": d.timestamp,
                    "Category": d.category,
                    "Amount": +d.amount,
                    "Age": +d.age,
                    "EducationLevel": d.educationLevel,
                    "AgeGroup": d.ageGroup,
                    "MonthNumber": +d.monthNum
                }
            })
            plotInnovativeChart(globalExpenseDataset)

        })

});

function plotInnovativeChart(data) {
    console.log("------->", data)
    globalExpenseDataset.forEach(d => {

        if (!educationLevelList.includes(d.EducationLevel)) {

            educationLevelList.push(d.EducationLevel)
        }
        if (!ageGroupList.includes(d.AgeGroup)) {
            ageGroupList.push(d.AgeGroup)
        }
        if (!categoryList.includes(d.category)) {
            categoryList.push(d.category)
        }
    })
    var svg = d3.select("#vanshaj")
    height = +svg.style("height").replace("px", '');
    width = +svg.style("width").replace("px", '');

    chartHeight = height - margin.top - margin.bottom
    chartWidth = width - margin.left - margin.right

    const g = svg.append("g")
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    var xScale = d3.scaleLinear()
        .domain([0, 15])
        .range([0, chartWidth])

    var xAxis = d3.axisBottom(xScale)

    g.append('g').call(xAxis)
        .attr('transform', `translate(0,${chartHeight})`)


    for (var i = 1; i <= 15; i++) {
        var totolWage = 0
        var totalShelter = 0
        var totalEducation = 0
        var totalRentAdjustment = 0
        var totalFood = 0
        var totalRecreation = 0
        var lengthOfData = 0
        data.forEach(function (d) {
            if (d.MonthNumber == i) {
                switch (d.Category) {
                    case "Wage":
                        totolWage += d.Amount
                        break
                    case "Shelter":
                        totalShelter += d.Amount
                        lengthOfData += 1
                        break
                    case "Education":
                        totalEducation += d.Amount
                        lengthOfData += 1
                        break
                    case "RentAdjustment":
                        totalRentAdjustment += d.Amount
                        break
                    case "Food":
                        totalFood += d.Amount
                        lengthOfData += 1
                        break
                    case "Recreation":
                        totalRecreation += d.Amount
                        lengthOfData += 1
                        break
                }
            }
        })
        // console.log(i, totolWage, totalShelter, totalEducation, totalRentAdjustment, totalFood, totalRecreation)

        pieData[i - 1] = {
            "MonthNumber": i,
            "Saving": parseFloat((totolWage - totalShelter - totalEducation + totalRentAdjustment - totalFood - totalRecreation).toFixed(2)),
            "Shelter": -1 * parseFloat(totalShelter.toFixed(2)),
            "Education": -1 * parseFloat(totalEducation.toFixed(2)),
            "Food": -1 * parseFloat(totalFood.toFixed(2)),
            "Recreation": -1 * parseFloat(totalRecreation.toFixed(2)),
            "LengthOfData": lengthOfData,
            "AvgExpense": (-1 * parseFloat((totalEducation + totalFood + totalRecreation + totalShelter).toFixed(2))) / lengthOfData
        }
    }

    console.log(pieData)
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(function (d) {
            return 50
        })

    console.log(Object.entries(pieData))
    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            var lst = []
            lst.push(d[1].Saving)
            lst.push(d[1].Shelter)
            lst.push(d[1].Education)
            lst.push(d[1].Food)
            lst.push(d[1].Recreation)
            console.log("pie---------->>>>>>>", d[1], lst)
            return lst
        })
    colors = d3.scaleOrdinal().domain(["Saving", "Shelter", "Education", "Food", "Recreation"]).range(colorCodes)

    var pieCharts = svg.selectAll('g')
        .data(pieData)
        .enter()
        .append("g")
        .property("radius", function (d) { return d.AvgExpense })
        .attr("transform", function (d) { return `translate(${d.MonthNumber}, ${chartHeight / 2})` })

    var finalPieData = pie(Object.entries(pieData))
    pieCharts.selectAll()
    .data(finalPieData)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", function(d, i){
        console.log(i)
        var x = d3.schemeCategory10
        return x[i]
    })


    // var simulation = d3.forceSimulation(pieData)
    //     .force('charge', d3.forceManyBody().strength(4))
    //     .force('x', d3.forceX().x(function (d) {
    //         return xScale(d.MonthNumber)
    //     }))
    //     .force('y', d3.forceY().y(function (d) {
    //         return chartHeight / 2
    //     }))
    //     .force('collision', d3.forceCollide().radius(function (d) {
    //         return d.AvgExpense
    //     }))

    // var numIterations = 10
    // for (let i = 0; i < numIterations; i++) {
    //     simulation.tick();
    // }

    // simulation.on('end', (d) => {
    //     var svg = d3.select("#vanshaj")
    //     svg.selectAll("circle")
    // })


}

