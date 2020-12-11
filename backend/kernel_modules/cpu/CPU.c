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
#include <linux/mm.h> 

struct task_struct *task;
struct task_struct *task_child;
struct list_head *list;
static const int pagesize = 4;  // in Kb

static const char *filename = "p_grupo4";

char buffer[256];
char * get_task_state(long state)
{
        //Info -- https://www.ibm.com/developerworks/linux/library/l-task-killable/
    switch (state) {
        case TASK_RUNNING:
            return "RUNNING";
        case TASK_INTERRUPTIBLE:
            return "SLEEP";
        case TASK_UNINTERRUPTIBLE:
            return "SLEEP";
        case TASK_WAKING:
            return "WAKING";
        case __TASK_STOPPED:
            return "STOPPED";
        case TASK_STOPPED:
            return "STOPPED";
        case __TASK_TRACED:
            return "TRACED";
        case EXIT_ZOMBIE:
            return "EXIT_ZOMBIE";
        case EXIT_DEAD:
            return "EXIT_DEAD";
        case TASK_DEAD:
            return "DEAD";
        case TASK_PARKED:
            return "PARKED";
        case TASK_IDLE:
            return "IDLE";
        default:
        {
            printk("Unknown Type:%ld\n", state);
            return buffer;
        }
    }
}

static int show_cpu_info(struct seq_file *f, void *v) {
        //Procesos Padre
        seq_printf(f, "{\"root\":[");
	for_each_process(task){
                long ram = 0L;
                char * status = "";
                int counter = 0;
                if((task->mm)!= NULL) {
                        ram = ((task->mm)->total_vm * pagesize) / 1024; // number of pages times pagesize. In Mb
		        // printk( "ram: %ld;", ram);
                }
                status = get_task_state(task->state);
                //printk( "status: %ld;", status);

                seq_printf(f, "{\"PID\":\"%d\",\"nombre\":\"%s\",\"usuario\":\"%d\",\"estado\":\"%s\",\"RAM\":\"%ld\",\"children\":", task->pid, task->comm, task->cred->uid.val, status, ram);
                //Procesos Hijos
                seq_printf(f, "[");
                list_for_each(list, &task->children){
                        long child_ram = 0L;
                        char * child_status = "";
                        task_child = list_entry(list, struct task_struct, sibling);
                        if((task_child->mm)!= NULL) {
                                child_ram = ((task_child->mm)->total_vm * pagesize) / 1024; // number of pages times pagesize. In Mb
		                // printk( "child ram: %ld;", child_ram);
                        }
                        
                        child_status = get_task_state(task_child->state);
                        //printk( "child_status: %ld;", child_status);
                        if (counter == 0) {
                            counter = counter + 1;
                            seq_printf(f, "{\"PID\":\"%d\",\"nombre\":\"%s\",\"usuario\":\"%d\",\"estado\":\"%s\",\"RAM\":\"%ld\"}", task_child->pid, task_child->comm, task_child->cred->uid.val, child_status, child_ram);
                        } else {
                            seq_printf(f, ",{\"PID\":\"%d\",\"nombre\":\"%s\",\"usuario\":\"%d\",\"estado\":\"%s\",\"RAM\":\"%ld\"}", task_child->pid, task_child->comm, task_child->cred->uid.val, child_status, child_ram);
                        }
                }
                seq_printf(f, "]");
                seq_printf(f, "},");
	}
        seq_printf(f, "]}");
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
        printk(KERN_INFO "Device file created: /proc/%s.\n", filename);
        printk(KERN_INFO "Buenas, att: Grupo 4, monitor de procesos\n");
        proc_create(filename, 0, NULL, &fops);
        return 0;
}

static void __exit terminar(void)
{
        printk(KERN_INFO "Module removed...\n");
        printk(KERN_INFO "Bai, att: Grupo 4 y este fue el monitor de procesos.\n");
	remove_proc_entry(filename,NULL);
}

module_init(iniciar);
module_exit(terminar);

MODULE_AUTHOR("Sistemas Operativos 2 - USAC - Grupo No. 4");
MODULE_DESCRIPTION("Kernel module to show CPU processes.");
MODULE_LICENSE("GPL");