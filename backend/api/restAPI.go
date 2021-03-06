package main

import (
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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, "SO2 Practica 1.")
}

func getRAM(w http.ResponseWriter, r *http.Request) {
	log.Println("Getting RAM info.")

	log.Println("Opening RAM file ")
	content, err := ioutil.ReadFile(ramFilePath)
	if err != nil {
		http.Error(w, err.Error(), 500)
		log.Print("Error reading /proc/m_grupo4 file.")
		fmt.Fprintf(w, "Error reading RAM file!")
		return
	}
	text := string(content)
	log.Println(text)

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, text)
}

func getCPU(w http.ResponseWriter, r *http.Request) {
	log.Println("Getting CPU info.")

	log.Println("Opening CPU file ")
	content, err := ioutil.ReadFile(cpuFilePath)
	if err != nil {
		http.Error(w, err.Error(), 500)
		log.Print("Error reading /proc/p_grupo4 file.")
		fmt.Fprintf(w, "Error reading CPU file!")
		return
	}

	text := string(content)
	s := []rune(text)
	s[len(text)-3] = ' '

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, string(s))
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

	w.Header().Set("Access-Control-Allow-Origin", "*")

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
