using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using MongoDB.Bson;
using MongoDB.Driver;

namespace mongoDotNet
{
    public partial class Form1 : Form
    {
        IMongoClient _client;
        IMongoDatabase _database;

        public Form1()
        {
            InitializeComponent();

            btnGetUsers.Enabled = btnAdd.Enabled = false;

        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            try
            {
                _client = new MongoClient(txtUrl.Text);
                _database = _client.GetDatabase(txtDb.Text);

                btnGetUsers.Enabled = btnAdd.Enabled = true;


            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);

                btnGetUsers.Enabled = btnAdd.Enabled = false;


                //throw;
            }
        }

        private void btnGetUsers_Click(object sender, EventArgs e)
        {
            fillUsers();
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            var user = new BsonDocument
            {
                { "name", txtName.Text },
                { "email", txtEmail.Text },
                { "pwd", txtPwd.Text },
                { "isActive", chkActive.Checked }
            };

            var collection = _database.GetCollection<BsonDocument>("users");

            collection.InsertOne(user);

            fillUsers();

        }

        private void fillUsers()
        {
            var collection = _database.GetCollection<BsonDocument>("users");

            //var filter = new BsonDocument();
            var filter = Builders<BsonDocument>.Filter.Eq("isActive", true);

            var f1 = collection.Find(filter);
            var l1 = f1.ToList<BsonDocument>();

            lstUsers.Items.Clear();

            foreach (var doc in l1)
            {
                lstUsers.Items.Add(doc["name"]);
            }
        }
    }
}
