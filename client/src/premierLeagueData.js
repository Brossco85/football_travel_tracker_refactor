var PremierLeagueTable = function(){
  var url = 'http://api.football-data.org/v1/competitions/426/leagueTable';
  makeRequest(url, requestComplete);
}

var makeRequest = function(url, callback){
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.setRequestHeader("X-Auth-Token", "795581b721014c898569d2bee06c9012");
  request.onload = callback;
  request.send();
}

var requestComplete = function(){
  if (this.status !== 200) return;
  var jsonString = this.responseText;
  console.log(jsonString);
  var league = JSON.parse(jsonString);
  createLeagueTable(league);
}

var createLeagueTable = function(leagueData){
  var standing = leagueData.standing;
  var table = document.getElementById('table-elements');
    for (i = 0; i < standing.length; i++) {
      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      var td3 = document.createElement('td');
      var td4 = document.createElement('td');
      var td5 = document.createElement('td');
      var td6 = document.createElement('td');
      var td7 = document.createElement('td');
      var td8 = document.createElement('td');
      var td9 = document.createElement('td');
      var td10 = document.createElement('td');
      var td11 = document.createElement('td');
      var img = document.createElement('img');
      var team = standing[i];
      img.setAttribute("src", team.crestURI);
      img.setAttribute("id", "crest-picture")
      td1.innerText = i + 1;
      td2.appendChild(img);
      td3.innerText = team.teamName;
      td4.innerText = team.playedGames;
      td5.innerText = team.wins;
      td6.innerText = team.draws;
      td7.innerText = team.losses;
      td8.innerText = team.goals;
      td9.innerText = team.goalsAgainst;
      td10.innerText = team.goalDifference;
      td11.innerText = team.points;
      table.appendChild(tr);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);
      tr.appendChild(td7);
      tr.appendChild(td8);
      tr.appendChild(td9);
      tr.appendChild(td10);
      tr.appendChild(td11);
      
    }

}

module.exports = PremierLeagueTable;
