const ip = 'http://34.69.2.19/'

function cargarcpu(){
    sessionStorage.clear("ejex");
    sessionStorage.clear("usedram");
    sessionStorage.clear("totalram");
    sessionStorage.clear("freeram");
    console.log("cargarcpu")
    $.ajax({
      type: "GET",
      url: ip+"cpu",
      dataType: 'json',
      error : function(errorThrown,err,textStatus){
        console.log(textStatus)
        console.log(err)
        console.log(errorThrown)
      },
      success : function(data){
        //console.log(data)
        LlenarDatos(data)
        LlenarTabla(data)
      }
    });
}


function lee_json() {
    let cont = 0
    $.getJSON("prueba.json", function(datos) {
        LlenarDatos(datos)
        LlenarTabla(datos)
    });
}


function LlenarDatos(datos){
    let toJSON = datos
    let proccont=0
    let ejeccont=0
    let zombiecont=0
    let stopcont=0
    let suspendcont=0
  
    toJSON.root.forEach(element => {
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


  function LlenarTabla(datos){
    let toJSON = datos
    var tbody = document.getElementById('tbody');
    let html = ""
    toJSON.root.forEach(element => {
        html+='<tr style="background-color: greenyellow;">\n'
        html+="<td>"+element.PID+"</td>\n"
        html+="<td>"+element.nombre+"</td>\n"
        html+="<td>"+element.usuario+"</td>\n"
        html+="<td>"+element.estado+"</td>\n"
        html+="<td>"+element.RAM+"</td>\n"
        html+= "<td><button class='btn btn-primary btn-block'  type='button' name="+element.PID+" id="+element.PID+" value="+element.PID+" onclick=killproc("+element.PID+")>KILL</button></td>"
        html+="</tr>\n"
        element.children.forEach(hijo =>{
        });
    });
    tbody.innerHTML = html;
  }

function killproc(PID){
    alert(PID)
    $.ajax({
        url: ip+"kill",
        type:"POST",
        dataType: "text",
        headers: {
            "Content-Type": "text/plain"
        },
        data: "".concat(PID),
        success: function(response){
            console.log(response);
        },
        error : function(errorThrown,err,textStatus){
            console.log(textStatus)
            console.log(err)
            console.log(errorThrown)
        }
    });
}

