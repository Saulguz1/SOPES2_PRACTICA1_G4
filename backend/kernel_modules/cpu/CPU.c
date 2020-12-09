#include <linux/module.h> 
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/list.h>
#include <linux/types.h>
#include <linux/slab.h>
#include <linux/sched.h>
#include <linux/string.h>
#include <linux/fs.h>
#include <linux/seq_file.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h> 
#include <linux/hugetlb.h>
#include <linux/sched/signal.h>
#include <linux/sched.h> 

struct task_struct *task;
struct task_struct *task_child;
struct list_head *list;
static const int pagesize = 4096;  // in Kb

static const char *filename = "p_grupo4";

static int show_cpu_info(struct seq_file *f, void *v) {
        seq_printf(f, "pagesize : %d\n\t", pagesize);
        //Procesos Padre
        seq_printf(f, "{\n\t[\n\t");
	// for_each_process(task){
        //         int ram = 0;
        //         ram = (task->mm->total_vm * pagesize) / 1024;  // number of pages times pagesize in Mb
        //         seq_printf(f, "{\n\t\"PID\":\"%d\",\n\t\"nombre\":\"%s\",\n\t\"usuario\":\"%d\",\n\t\"estado\":\"%ld\",\n\t\"RAM\":\"%d\"\n,\n\t\"children\":\n", task->pid, task->comm, task->cred->uid.val, task->state, ram);
        //         //Procesos Hijos
        //         seq_printf(f, "[\n\t");
        //         list_for_each(list, &task->children){
        //                 int child_ram = 0;
        //                 task_child = list_entry(list, struct task_struct, sibling);
        //                 child_ram = (task_child->mm->total_vm * pagesize) / 1024;  // number of pages times pagesize in Mb
        //                 seq_printf(f, "{\n\t\"PID\":\"%d\",\n\t\"nombre\":\"%s\",\n\t\"usuario\":\"%d\",\n\t\"estado\":\"%ld\",\n\t\"RAM\":\"%d\"\n},\n", task_child->pid, task_child->comm, task_child->cred->uid.val, task_child->state, child_ram);
        //         }
        //         seq_printf(f, "]\n");
        //         seq_printf(f, "},\n");
	// }
        seq_printf(f, "]\n}\n");
        return 0;
}

static int open_file_function(struct inode *inode, struct  file *file) {
        return single_open(file, show_cpu_info, NULL);
}

static const struct file_operations fops =
{
        .owner = THIS_MODULE,
        .open = open_file_function,
        .read = seq_read,
        .llseek = seq_lseek,
        .release = single_release,
};

static int __init iniciar(void)
{
        printk(KERN_INFO "Module loaded...\n");
        proc_create(filename, 0, NULL, &fops);
        printk(KERN_INFO "Device file created: /proc/%s.\n", filename);
        printk(KERN_INFO "Buenas, att. Grupo 4, monitor de procesos");
        return 0;
}

static void __exit terminar(void)
{
	remove_proc_entry(filename,NULL);
  	printk(KERN_INFO "Module removed...\n");
        printk(KERN_INFO "Bai, att. Grupo 4 y este fue el monitor de procesos.");
}

module_init(iniciar);
module_exit(terminar);

MODULE_AUTHOR("Sistemas Operativos 2 - USAC - Grupo No. 4");
MODULE_DESCRIPTION("Kernel module to show CPU processes.");
MODULE_LICENSE("GPL");