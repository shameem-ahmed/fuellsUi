using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using PusherRealtimeChat.WebAPI.Models;
using PusherServer;

namespace PusherRealtimeChat.WebAPI.Controllers
{
    [EnableCors("*", "*", "*")]
    public class MessagesController : ApiController
    {
        private static List<ChatMessage> messages = new List<ChatMessage>()
        {
            new ChatMessage { AuthorTwitterHandle = "Pusher", Text="Hi there! ?" },
            new ChatMessage { AuthorTwitterHandle = "Pusher", Text="Welcome to your chat app" }

        };

        public HttpResponseMessage Get()
        {
            return Request.CreateResponse(HttpStatusCode.OK, messages);
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(ChatMessage message)
        {
            if(message == null || !ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid input");
            }

            messages.Add(message);

            var pusher = new Pusher(
                "359942",
                "b2a168c9ae832da917fa",
                "a369ee19130e6f43cce3",
                new PusherOptions
                {
                    Cluster = "ap2",
                    Encrypted = true
                });

            var result = await pusher.TriggerAsync(
                channelName: "messages",
                eventName: "new_message",
                data: new
                {
                    AuthorTwitterHandler = message.AuthorTwitterHandle,
                    Text = message.Text
                });

            return Request.CreateResponse(HttpStatusCode.Created);
        }
    }
}
