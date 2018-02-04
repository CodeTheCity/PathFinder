using System.Configuration;
using System.Data.Common;
using System.Data.Entity;
using System.Data.SqlClient;

namespace Functions.Entities {
    public class DataContext : DbContext {
        private static readonly string connectionString = ConfigurationManager
                 .ConnectionStrings["FunctionsConnectionString"].ConnectionString;

        public DataContext() : base(CreateConnection(), true) {
        }

        private static DbConnection CreateConnection() {
            return new SqlConnection(connectionString);
        }

        public DbSet<Tour> Tours { get; set; }

        public DbSet<Waypoint> Waypoints { get; set; }
    }
}
