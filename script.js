function init() {
	console.log('Test');

  // Variabili generali
  var next = $(".next");
  var prev = $(".prev");
  var monthList= $(".month-list");
  var baseMonth = moment('2018-01-01');
  var source = $('#day-template').html();
  var template = Handlebars.compile(source);

  printMonth(template, baseMonth);
  printHoliday(baseMonth);

  // Possibilità di cambiare mese
  prev.click(function(){
    if(baseMonth.month()== 0){
      alert("Non puoi andare oltre!");
    }
    else{
      baseMonth.substract(1, "M");
      monthList.children().remove();
      printMonth(template, baseMonth);
      printHoliday(baseMonth);

    }

  })

  next.click(function(){
    if(baseMonth.month() == 11){
      alert("Non puoi andare oltre!");
    }
    else{
      baseMonth.add(1, "M");
      monthList.children().remove();
      printMonth(template, baseMonth);
      printHoliday(baseMonth);

    }
  })
}

$(document).ready(init);


// FUNCTIONS

// Stampo i giorni del mese
function printMonth(template, date) {
  // Numero giorni nel mese
  var daysInMonth = date.daysInMonth();

  // Imposto il nome del mese
  $('h1').html( date.format('MMMM YYYY') );
  $('.month').attr('data-this-date', date.format('YYYY-MM-DD'));

  // Generare giorni del mese
  for (var i = 0; i < daysInMonth; i++) {
    // Moment js
    var thisDate = moment({
      year: date.year(),
      month: date.month(),
      day: i + 1
    });

    // Template
    var context = {
      class: 'day',
      day: thisDate.format('DD'),
      completeDate: thisDate.format('YYYY-MM-DD')
    };

    var html = template(context);
    $('.month-list').append(html);
  }
}

// Ottieni e stampa festività
function printHoliday(date) {
  // Richiamo l'API
  $.ajax({
    url: 'https://flynn.boolean.careers/exercises/api/holidays' ,
    method: 'Get',
    data: {
      year: date.year(),
      month: date.month()
    },
    success: function(res) {
      var holidays = res.response;

      for (var i = 0; i < holidays.length; i++) {
        var thisHoliday = holidays[i];

        var listItem = $('li[data-complete-date="' + thisHoliday.date + '"]');

        if(listItem) {
          listItem.addClass('holiday');
          listItem.text( listItem.text() + ' - ' + thisHoliday.name );
        }
      }
    },
    error: function() {
      console.log('Errore!');
    }

  });

}
