#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/fs.h>
#include <linux/mm.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>

static const char *filename = "m_grupo4";
struct sysinfo i;

static int show_memory_info(struct seq_file *f, void *v)
{
    int32_t used;
    int32_t total;
    int32_t freeram;
    int32_t usage_percentage;
    si_meminfo(&i);
    total = ((uint64_t)i.totalram * i.mem_unit) / 1024 / 1024;
    freeram = ((uint64_t)i.freeram * i.mem_unit) / 1024 / 1024;
    used = total - freeram;
    usage_percentage = (100 * used) / total;
    // Values in Mb
    seq_printf(f, "{\n\t\"total\":\"%d\",\n\t\"used\":\"%d\",\n\t\"free\":\"%d\",\n\t\"usage_percentage\":\"%d\"\n}\n", total, used, freeram, usage_percentage);
    return 0;
}

static int meminfo_proc_open(struct inode *inode, struct file *file)
{
    return single_open(file, show_memory_info, NULL);
}
static const struct file_operations fops = {
    .owner = THIS_MODULE,
    .open = meminfo_proc_open,
    .read = seq_read,
    .llseek = seq_lseek,
    .release = single_release,
};

static int __init ram_init(void)
{
    printk(KERN_INFO "Module loaded...\n");
    printk(KERN_INFO "Device file created: /proc/%s.\n", filename);
    printk(KERN_INFO "Buenas, att: Grupo 4, monitor de memoria");
    proc_create(filename, 0, NULL, &fops);
    return 0;
}

static void __exit ram_exit(void)
{
    printk(KERN_INFO "Module removed...\n");
    printk(KERN_INFO "Bai, att: Grupo 4 y este fue el monitor de memoria");
    remove_proc_entry(filename, NULL);
}

module_init(ram_init);
module_exit(ram_exit);

MODULE_AUTHOR("Sistemas Operativos 2 - USAC - Grupo No. 4");
MODULE_DESCRIPTION("Kernel module to show total and used RAM.");
MODULE_LICENSE("GPL");
