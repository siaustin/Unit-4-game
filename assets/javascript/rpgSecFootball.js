$(document).ready(function() {
  var teams = {
    Alabama: {
      name: 'Alabama',
      health: 120,
      attack: 8,
      imageUrl: 'assets/images/alabama.png',
      opponentAttackBack: 15
    },
    Auburn: {
      name: 'Auburn',
      health: 100,
      attack: 14,
      imageUrl: 'assets/images/auburn.png',
      opponentAttackBack: 5
    },
    'Texas A&M': {
      name: 'Texas A&M',
      health: 150,
      attack: 8,
      imageUrl: 'assets/images/texas-a-m.png',
      opponentAttackBack: 20
    },
    LSU: {
      name: 'LSU',
      health: 180,
      attack: 7,
      imageUrl: 'assets/images/lsu.png',
      opponentAttackBack: 25
    }
  };

  // Variables

  var attacker;
  var opponents = [];
  var defender;
  var turnCounter = 1;
  var killCount = 0;

  // Functions

  var renderTeam = function(team, renderArea) {
    var teamDiv = $("<div class='team' data-name='" + team.name + "'>");
    var teamName = $("<div class='team-name'>").text(team.name);
    var teamImage = $("<img alt='image' class='team-image'>").attr(
      'src',
      team.imageUrl
    );
    var teamHealth = $("<div class='team-health'>").text(team.health);
    teamDiv
      .append(teamName)
      .append(teamImage)
      .append(teamHealth);
    $(renderArea).append(teamDiv);
  };

  var initializeGame = function() {
    for (var key in teams) {
      renderTeam(teams[key], '#teams-section');
    }
  };

  initializeGame();

  var updateTeam = function(teamObj, areaRender) {
    $(areaRender).empty();
    renderTeam(teamObj, areaRender);
  };

  var renderOpponents = function(opponentArr) {
    for (var i = 0; i < opponentArr.length; i++) {
      renderTeam(opponentArr[i], '#available-to-attack-section');
    }
  };

  var renderMessage = function(message) {
    var gameMessageSet = $('#game-message');
    var newMessage = $('<div>').text(message);
    gameMessageSet.append(newMessage);
  };

  var restartGame = function(resultMessage) {
    var restart = $('<button>Restart</button>').click(function() {
      location.reload();
    });
    var gameState = $('<div>').text(resultMessage);
    $('body').append(gameState);
    $('body').append(restart);
  };

  var clearMessage = function() {
    var gameMessage = $('#game-message');
    gameMessage.text('');
  };

  $('#teams-section').on('click', '.team', function() {
    var name = $(this).attr('data-name');

    if (!attacker) {
      attacker = teams[name];
      for (var key in teams) {
        if (key !== name) {
          opponents.push(teams[key]);
        }
      }
      $('#teams-section').hide();
      updateTeam(attacker, '#selected-team');
      renderOpponents(opponents);
    }
  });

  $('#available-to-attack-section').on('click', '.team', function() {
    var name = $(this).attr('data-name');

    if ($('#defender').children().length === 0) {
      defender = teams[name];
      updateTeam(defender, '#defender');
      $(this).remove();
      clearMessage();
    }
  });

  $('#attack-button').on('click', function() {
    if ($('#defender').children().length !== 0) {
      var attackMessage =
        'You attacked ' +
        defender.name +
        ' for ' +
        attacker.attack * turnCounter +
        ' damage.';
      var counterAttackMessage =
        defender.name +
        ' attacked you back for ' +
        defender.opponentAttackBack +
        ' damage.';
      clearMessage();

      defender.health -= attacker.attack * turnCounter;

      if (defender.health > 0) {
        updateTeam(defender, '#defender');
        renderMessage(attackMessage);
        renderMessage(counterAttackMessage);

        attacker.health -= defender.opponentAttackBack;
        updateTeam(attacker, '#selected-team');

        if (attacker.health <= 0) {
          clearMessage();
          restartGame('You have been defeated...GAME OVER!!!');
          $('#attack-button').off('click');
        }
      } else {
        $('#defender').empty();
        var gameStateMessage =
          'You have defeated ' +
          defender.name +
          ', you can choose to fight another opponent.';
        renderMessage(gameStateMessage);
        killCount++;
        if (killCount >= combatants.length) {
          clearMessage();
          $('#attack-button').off('click');
          restartGame('You Won!!!! GAME OVER!!!');
        }
      }
      turnCounter++;
    } else {
      clearMessage();
      renderMessage('No opponent here.');
    }
  });
});
