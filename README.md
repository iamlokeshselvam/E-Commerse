# E-Commerse

lxd

sudo su

-lxd -h

exit

-lxc

-lxc launch

eg: lxc launch ubuntu:22.04 ubuntu -t aws:t2.micro

-lxc list

//10.92.72.229 

ssh name@IPV4

-ssh-keygen

-cat ~/.ssh/id_rsa.pub | lxc exec <name> -- sh -c "cat >> /home/ubuntu/.ssh/authorized_keys"

-lxc exec app -- sh

//*
bash
root@app:~# 
root@app:~# 
root@app:~# 
root@app:~# cd /home/
root@app:/home# ll
total 4
drwxr-xr-x  3 root   root    3 Apr 23 06:42 ./
drwxr-xr-x 18 root   root   24 Apr 16 02:15 ../
drwxr-x---  3 ubuntu ubuntu  6 Apr 23 06:42 ubuntu/
root@app:/home# cd ubuntu/
root@app:/home/ubuntu# ls
root@app:/home/ubuntu# 
root@app:/home/ubuntu# 
root@app:/home/ubuntu# ll
total 9
drwxr-x--- 3 ubuntu ubuntu    6 Apr 23 06:42 ./
drwxr-xr-x 3 root   root      3 Apr 23 06:42 ../
-rw-r--r-- 1 ubuntu ubuntu  220 Jan  6  2022 .bash_logout
-rw-r--r-- 1 ubuntu ubuntu 3771 Jan  6  2022 .bashrc
-rw-r--r-- 1 ubuntu ubuntu  807 Jan  6  2022 .profile
drwx------ 2 ubuntu ubuntu    4 Apr 23 07:04 .ssh/
root@app:/home/ubuntu# cd .ssh/
root@app:/home/ubuntu/.ssh# ls
authorised_keys  authorized_keys
root@app:/home/ubuntu/.ssh# cat authori
cat: authori: No such file or directory
root@app:/home/ubuntu/.ssh# cat authori
authorised_keys  authorized_keys  
root@app:/home/ubuntu/.ssh# cat authori^C
root@app:/home/ubuntu/.ssh# 
exit
# 
*//


ssh ubuntu@IPV4
-------------------------------------------------------------------------------------------------------------------------------------------------------------------

*to delete cmd:

lxc delete name -- force

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

*jenkins secret password:

sudo cat /var/lib/jenkins/secrets/initialAdminPassword

*jenkins:

systemctl status jenkins

sudo systemctl restart jenkin

sudo systemctl start jenkins

------------------------------------------------------------------------------------------------------------------------------------------------------------------

*node install 

sudo apt install curl 

curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash

sudo apt install nodejs

node -v 
npm -v
