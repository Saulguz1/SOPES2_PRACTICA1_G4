const ip = 'http://34.69.2.19/'
let ejex = ""
let usedram = ""
let totalram = ""
let freeram = ""



function login(){
  let user = document.getElementById("inputUser").value
  let pass = document.getElementById("inputPassword").value
  let existe = false
  $.getJSON("users.json", function(datos) {
    datos.users.forEach(element => {
      if(element.id == user && element.pass==pass){
        existe = true
      }
    });
    
    if(existe){
      $.ajax({
        type:"GET",
        url:ip+"ram",
        crossDomain:true,
        success : function(data){
          var json = JSON.parse(JSON.stringify(data).replace("RowDataPacket ",""));
          sessionStorage.setItem("totalram", json.total+",");
          sessionStorage.setItem("ejex", ""+",");
          sessionStorage.setItem("usedram", json.used+",");
          sessionStorage.setItem("freeram", json.free+",");
          sessionStorage.setItem("user", user)
          sessionStorage.setItem("logueado", 1)
          window.location.href = "Principal.html";
        }
      });
      
    }else{alert('nein')}
  });
}



function verificar(){
  let logueado = sessionStorage.getItem("logueado")
  if (Number(logueado)==0) return false
  return true
}

function loadlogin(){
  if (verificar()) window.location.href = "Principal.html";
}

function loadprincipal(){
  if (!verificar()) window.location.href = "Login.html";
}


function cargarram(){
  if (!verificar()) window.location.href = "Login.html";
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
        
        let porcentaje = (Number(json.used) * 100 / Number(json.total)).toFixed(4) 

        document.getElementById("input_used").value = json.used + "  MB"
        document.getElementById("input_total").value = json.total + "  MB"
        document.getElementById("input_free").value = porcentaje + "  %"
        
        sessionStorage.setItem("ejex", ejex);
        sessionStorage.setItem("usedram", usedram);
        sessionStorage.setItem("totalram", totalram);
        sessionStorage.setItem("freeram", freeram);
      }
      else console.log(err)
    }
  });
}
function cerrarsesion(){
  sessionStorage.clear("ejex");
  sessionStorage.clear("usedram");
  sessionStorage.clear("totalram");
  sessionStorage.clear("freeram");
  sessionStorage.clear("user");
  sessionStorage.setItem("logueado",0);
  window.location.href = "Login.html";
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