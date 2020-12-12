const ip = 'http://34.69.2.19/'


function cerrarsesion(){
  sessionStorage.clear("ejex");
  sessionStorage.clear("usedram");
  sessionStorage.clear("totalram");
  sessionStorage.clear("freeram");
  window.location.href = "Login.html";
}

function cargarcpu(){
  if (!verificar()) window.location.href = "Login.html"
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

function verificar(){
  let logueado = sessionStorage.getItem("logueado")
  if (Number(logueado)==0) return false
  return true
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
    let totalram = "".concat(sessionStorage.getItem("totalram"))
    totalram = totalram.split(",")
    totalram.pop()
    totalram=totalram.pop()
    var tbody = document.getElementById('tbody');
    let html = ""
    toJSON.root.forEach(element => {
        html+='<tr style="background-color: greenyellow;">\n'
        html+="<td>"+element.PID+"</td>\n"
        html+="<td>"+element.nombre+"</td>\n"
        html+="<td>"+element.usuario+"</td>\n"
        html+="<td>"+element.estado+"</td>\n"
        let porcentaje = (Number(element.RAM) * 100 / Number(totalram)).toFixed(4) 
        html+="<td>"+porcentaje+"</td>\n"
        html+= "<td><button class='btn btn-primary btn-block'  type='submit' name="+element.PID+" id="+element.PID+" value="+element.PID+" onclick=killproc("+element.PID+")>KILL</button></td>"
        html+="</tr>\n"
        element.children.forEach(hijo =>{
          html+='<tr style="background-color: darksalmon;">\n'
          html+="<td>"+hijo.PID+"</td>\n"
          html+="<td>"+hijo.nombre+"</td>\n"
          html+="<td>"+hijo.usuario+"</td>\n"
          html+="<td>"+hijo.estado+"</td>\n"
          porcentaje = (Number(hijo.RAM) * 100 / Number(totalram)).toFixed(4) 
          html+="<td>"+porcentaje+"</td>\n"
          html+= "<td><button class='btn btn-primary btn-block'  type='submit' name="+hijo.PID+" id="+hijo.PID+" value="+hijo.PID+" onclick=killproc("+hijo.PID+")>KILL</button></td>"
          html+="</tr>\n"
        });
    });
    tbody.innerHTML = html;
  }

function killproc(PID){
    alert("Kill proc: "+PID)
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
            alert(response)
        },
        error : function(errorThrown,err,textStatus){
            console.log(textStatus)
            console.log(err)
            console.log(errorThrown)
        }
    });
}

