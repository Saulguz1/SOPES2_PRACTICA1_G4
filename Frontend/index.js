const ip = 'http://34.69.2.19/'
let ejex = ""
let usedram = ""
let totalram = ""
let freeram = ""

function cargarram(){
  ejex = sessionStorage.getItem("ejex");
  usedram = sessionStorage.getItem("usedram");
  totalram = sessionStorage.getItem("totalram");
  freeram = sessionStorage.getItem("freeram");

  $.ajax({
    type:"GET",
    url:ip+"ram",
    crossDomain:true,
    success : function(data,status,err){
      if(status == 'success'){
        var json = JSON.parse(JSON.stringify(data).replace("RowDataPacket ",""));
        if (ejex == null) ejex=""
        if (usedram == null) usedram=""
        if (totalram == null) totalram=""
        if (freeram == null) freeram=""

        ejex += ""+","
        usedram += json.used +","
        totalram += json.total+","
        freeram += json.free+","
        
        pintargraph(ejex.split(","),usedram.split(","),totalram.split(","),freeram.split(","))
        
        document.getElementById("input_used").value = json.used + "  MB"
        document.getElementById("input_total").value = json.total + "  MB"
        document.getElementById("input_free").value = json.free + "  MB"
        
        sessionStorage.setItem("ejex", ejex);
        sessionStorage.setItem("usedram", usedram);
        sessionStorage.setItem("totalram", totalram);
        sessionStorage.setItem("freeram", freeram);
      }
      else console.log(err)
    }
  });
}



function cargarcpu(){
  sessionStorage.clear("ejex");
  sessionStorage.clear("usedram");
  sessionStorage.clear("totalram");
  sessionStorage.clear("freeram");
  console.log("cargarcpu")
  $.ajax({
    type: "GET",
    url: ip+"cpu",
    success : function(data){
      console.log("data")
      console.log(data)
    }
  });
}

function LlenarDatos(datos){
  let toJSON = datos
  let proccont=0
  let ejeccont=0
  let zombiecont=0
  let stopcont=0
  let suspendcont=0
  console.log("data")
  console.log(datos)
  return "Success"

  toJSON.forEach(element => {
    proccont ++
    if(element.estado == "SLEEP") stopcont ++
    else if(element.estado == "IDLE") suspendcont ++
    else if(element.estado == "RUNNING") ejeccont ++
    else if(element.estado == "ZOMBIE") zombiecont ++
    element.children.forEach(hijo =>{
      proccont ++
      if(hijo.estado == "SLEEP") stopcont ++
      else if(hijo.estado == "IDLE") suspendcont ++
      else if(hijo.estado == "RUNNING") ejeccont ++
      else if(hijo.estado == "ZOMBIE") zombiecont ++
    });
  });
  document.getElementById("input_total").value = proccont
  document.getElementById("input_ejecucion").value = ejeccont
  document.getElementById("input_detenidos").value = stopcont
  document.getElementById("input_suspendidos").value = suspendcont
  document.getElementById("input_zombies").value = zombiecont
}

function pintargraph(varejex,varused,vartotal,varfree){
  varejex.pop()
  varused.pop()
  vartotal.pop()
  varfree.pop()
  var config = {
    type: 'line',
    data: {
        labels: varejex,
        datasets: [{
            label: 'Usada',
            backgroundColor: '#FFFFFF',
            borderColor: 'green',
            data: varused,
            fill: false,
        },{
            label: 'Libre',
            backgroundColor: '#FFFFFF',
            borderColor: 'red',
            data: varfree,
            fill: false,
        },{
            label: 'Total',
            backgroundColor: '#FFFFFF',
            borderColor: 'blue',
            data: vartotal,
            fill: false,
        }]
    },
    options: {
        responsive: true,

        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString:'Ram'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Porcentage'
                }
            }]
        }
    }
  };

  var ctx = document.getElementById('canvas').getContext('2d');
  window.myLine = new Chart(ctx, config);
}