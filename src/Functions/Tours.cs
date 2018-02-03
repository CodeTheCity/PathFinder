using System.Linq;
using System.Net;
using System.Net.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace Functions
{
    public static class Tours {
        [FunctionName("GetAllTours")]
        public static HttpResponseMessage GetAllTours(
            [HttpTrigger(AuthorizationLevel.Anonymous, "GET", Route = "Tours/")]HttpRequestMessage req,
            TraceWriter log) {
            log.Info("C# HTTP trigger function processed a request.");

            // Fetching the name from the path parameter in the request URL
            return req.CreateResponse(HttpStatusCode.OK, "Hello world!");
        }

        [FunctionName("GetTours")]
        public static HttpResponseMessage GetTours(
            [HttpTrigger(AuthorizationLevel.Anonymous, "GET", Route = "Tours/name/{name}")]HttpRequestMessage req,
            string name,
            TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            // Fetching the name from the path parameter in the request URL
            return req.CreateResponse(HttpStatusCode.OK, "Hello " + name);
        }
    }
}
