package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

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

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, text)
}

func handleRequests() {
	r := mux.NewRouter()

	r.HandleFunc("/", home).Methods("GET")
	r.HandleFunc("/ram", getRAM).Methods("GET")
	r.HandleFunc("/cpu", getCPU).Methods("GET")

	log.Fatal(http.ListenAndServe(":80", r))
}

func main() {
	log.Print("REST server up and running...")
	handleRequests()
}
