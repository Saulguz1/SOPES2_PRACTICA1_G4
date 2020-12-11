package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"syscall"

	"github.com/gorilla/mux"
)

var ramFilePath = "/proc/m_grupo4"
var cpuFilePath = "/proc/p_grupo4"

func home(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "SO2 Practica 1.")
}

func getRAM(w http.ResponseWriter, r *http.Request) {
	log.Println("Getting RAM info.")

	fmt.Println("Opening RAM file ")
	content, err := ioutil.ReadFile(ramFilePath)
	if err != nil {
		http.Error(w, err.Error(), 500)
		log.Print("Error reading /proc/m_grupo4 file.")
		fmt.Fprintf(w, "Error reading RAM file!")
		return
	}
	text := string(content)
	fmt.Println(text)

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, text)
}

func getCPU(w http.ResponseWriter, r *http.Request) {
	log.Println("Getting CPU info.")

	fmt.Println("Opening CPU file ")
	content, err := ioutil.ReadFile(cpuFilePath)
	if err != nil {
		http.Error(w, err.Error(), 500)
		log.Print("Error reading /proc/p_grupo4 file.")
		fmt.Fprintf(w, "Error reading CPU file!")
		return
	}

	text := string(content)
	fmt.Println(text)

	in := []byte(text)
	var raw map[string]interface{}
	if err := json.Unmarshal(in, &raw); err != nil {
		http.Error(w, err.Error(), 500)
		log.Print("Error unmarshaling /proc/p_grupo4 file.")
		fmt.Fprintf(w, "Error unmarshaling file!")
		return
	}

	out, _ := json.Marshal(raw)
	println(string(out))

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, string(out))
}

func killProcess(w http.ResponseWriter, r *http.Request) {
	reqBody, _ := ioutil.ReadAll(r.Body)
	bodyString := string(reqBody)

	log.Println("Killing process: ", bodyString)

	pidInt, _ := strconv.ParseInt(bodyString, 10, 32)
	pid := int(pidInt)

	err := syscall.Kill(pid, 9)

	if err != nil {
		http.Error(w, err.Error(), 500)
		log.Print("Error killing process with PID: ", pid)
		fmt.Fprintf(w, "Error killing process with PID: %+v", pid)
		return
	}

	fmt.Fprintf(w, "Process with PID %+v killed.", pid)
}

func handleRequests() {
	r := mux.NewRouter()

	r.HandleFunc("/", home).Methods("GET")
	r.HandleFunc("/ram", getRAM).Methods("GET")
	r.HandleFunc("/cpu", getCPU).Methods("GET")
	r.HandleFunc("/kill", killProcess).Methods("POST")

	log.Fatal(http.ListenAndServe(":80", r))
}

func main() {
	f, err := os.OpenFile("logs", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	log.SetOutput(f)

	log.Print("REST server up and running...")
	handleRequests()
}
