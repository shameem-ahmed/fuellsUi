namespace mongoDotNet
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.lstUsers = new System.Windows.Forms.ListBox();
            this.btnGetUsers = new System.Windows.Forms.Button();
            this.txtUrl = new System.Windows.Forms.TextBox();
            this.txtDb = new System.Windows.Forms.TextBox();
            this.btnConnect = new System.Windows.Forms.Button();
            this.txtName = new System.Windows.Forms.TextBox();
            this.txtEmail = new System.Windows.Forms.TextBox();
            this.txtPwd = new System.Windows.Forms.TextBox();
            this.chkActive = new System.Windows.Forms.CheckBox();
            this.btnAdd = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // lstUsers
            // 
            this.lstUsers.FormattingEnabled = true;
            this.lstUsers.Location = new System.Drawing.Point(17, 89);
            this.lstUsers.Name = "lstUsers";
            this.lstUsers.Size = new System.Drawing.Size(180, 186);
            this.lstUsers.TabIndex = 0;
            // 
            // btnGetUsers
            // 
            this.btnGetUsers.Location = new System.Drawing.Point(17, 60);
            this.btnGetUsers.Name = "btnGetUsers";
            this.btnGetUsers.Size = new System.Drawing.Size(180, 23);
            this.btnGetUsers.TabIndex = 1;
            this.btnGetUsers.Text = "Get Users";
            this.btnGetUsers.UseVisualStyleBackColor = true;
            this.btnGetUsers.Click += new System.EventHandler(this.btnGetUsers_Click);
            // 
            // txtUrl
            // 
            this.txtUrl.Location = new System.Drawing.Point(17, 21);
            this.txtUrl.Name = "txtUrl";
            this.txtUrl.Size = new System.Drawing.Size(180, 20);
            this.txtUrl.TabIndex = 2;
            this.txtUrl.Text = "mongodb://localhost:27017";
            // 
            // txtDb
            // 
            this.txtDb.Location = new System.Drawing.Point(209, 21);
            this.txtDb.Name = "txtDb";
            this.txtDb.Size = new System.Drawing.Size(90, 20);
            this.txtDb.TabIndex = 3;
            this.txtDb.Text = "rpa1db";
            // 
            // btnConnect
            // 
            this.btnConnect.Location = new System.Drawing.Point(305, 21);
            this.btnConnect.Name = "btnConnect";
            this.btnConnect.Size = new System.Drawing.Size(84, 23);
            this.btnConnect.TabIndex = 4;
            this.btnConnect.Text = "Connect";
            this.btnConnect.UseVisualStyleBackColor = true;
            this.btnConnect.Click += new System.EventHandler(this.btnConnect_Click);
            // 
            // txtName
            // 
            this.txtName.Location = new System.Drawing.Point(209, 89);
            this.txtName.Name = "txtName";
            this.txtName.Size = new System.Drawing.Size(180, 20);
            this.txtName.TabIndex = 5;
            this.txtName.Text = "Shameem Ahmed A";
            // 
            // txtEmail
            // 
            this.txtEmail.Location = new System.Drawing.Point(209, 115);
            this.txtEmail.Name = "txtEmail";
            this.txtEmail.Size = new System.Drawing.Size(180, 20);
            this.txtEmail.TabIndex = 6;
            this.txtEmail.Text = "shameem.ahmed.a@hp.com";
            // 
            // txtPwd
            // 
            this.txtPwd.Location = new System.Drawing.Point(209, 141);
            this.txtPwd.Name = "txtPwd";
            this.txtPwd.Size = new System.Drawing.Size(180, 20);
            this.txtPwd.TabIndex = 7;
            this.txtPwd.Text = "P@ssw0rd";
            // 
            // chkActive
            // 
            this.chkActive.AutoSize = true;
            this.chkActive.Checked = true;
            this.chkActive.CheckState = System.Windows.Forms.CheckState.Checked;
            this.chkActive.Location = new System.Drawing.Point(209, 167);
            this.chkActive.Name = "chkActive";
            this.chkActive.Size = new System.Drawing.Size(56, 17);
            this.chkActive.TabIndex = 8;
            this.chkActive.Text = "Active";
            this.chkActive.UseVisualStyleBackColor = true;
            // 
            // btnAdd
            // 
            this.btnAdd.Location = new System.Drawing.Point(299, 190);
            this.btnAdd.Name = "btnAdd";
            this.btnAdd.Size = new System.Drawing.Size(90, 23);
            this.btnAdd.TabIndex = 9;
            this.btnAdd.Text = "Save New";
            this.btnAdd.UseVisualStyleBackColor = true;
            this.btnAdd.Click += new System.EventHandler(this.btnAdd_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(411, 292);
            this.Controls.Add(this.btnAdd);
            this.Controls.Add(this.chkActive);
            this.Controls.Add(this.txtPwd);
            this.Controls.Add(this.txtEmail);
            this.Controls.Add(this.txtName);
            this.Controls.Add(this.btnConnect);
            this.Controls.Add(this.txtDb);
            this.Controls.Add(this.txtUrl);
            this.Controls.Add(this.btnGetUsers);
            this.Controls.Add(this.lstUsers);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListBox lstUsers;
        private System.Windows.Forms.Button btnGetUsers;
        private System.Windows.Forms.TextBox txtUrl;
        private System.Windows.Forms.TextBox txtDb;
        private System.Windows.Forms.Button btnConnect;
        private System.Windows.Forms.TextBox txtName;
        private System.Windows.Forms.TextBox txtEmail;
        private System.Windows.Forms.TextBox txtPwd;
        private System.Windows.Forms.CheckBox chkActive;
        private System.Windows.Forms.Button btnAdd;
    }
}

