#############################################################################################################
# .SYNOPSIS
#  Export the a SQL table to a Json format file
#
# .DESCRIPTION
#  Export the SQL table specified to a Json format file in the current directory
#
# .PARAMETER Server
#  SQL Server\Instance name (alias -s)
#
# .PARAMETER Database
#  SQL Database name (alias -d)
#
# .PARAMETER Table
#  SQL table name (alias -t)
#
# .PARAMETER OutFile
#  Output file name for the results (alias -o)
#
# .PARAMETER v
#  A switch which when true prints out the script's version information (include type information)
#  
# .EXAMPLE
#  ExportSQLTableToJson.ps1 -s SCHVW2K12R2-DB\MSSQL2014 -d Customer -t Contact -o contact.json -v
#
#  Short-hand syntax of the script
#
# .EXAMPLE
#  ExportSQLTableToJson.ps1 -Server SCHVW2K12R2-DB\MSSQL2014 -Database Customer -Table Contact -OutFile contact.json -v
#
#  Print out the the scripts version information 
#
# .NOTES
#  You don't need to run this script with any special permissions
# 
#   Author: Warren Wiltshire (Warren@SeagullConsulting.Biz)
#   Date: 01/25/2016
#   Change Log:
#     0.9.0(01/25/2016) - Initial script
#############################################################################################################
Param (
	[parameter(Mandatory=$true)]
	[alias ('s')] [string] $Server,
	[parameter(Mandatory=$true)]
	[alias ('d')] [string] $Database,
	[parameter(Mandatory=$true)]
	[alias ('t')] [string] $Table,
	[parameter(Mandatory=$true)]
	[alias ('o')] [string] $OutFile,
	[switch] $v = $false	
)
# Define functions
function Version
{
  return '0.9.1';
}
function ExportTable ($tbl, $oFile)
{
     $SqlSelect = "SELECT * FROM {0}" 
	$SqlQuery = $SqlSelect -f $tbl
     $SqlCmd = New-Object System.Data.SqlClient.SqlCommand
	$SqlCmd.Connection = $SqlConnection
     $SqlCmd.CommandText = $SqlQuery 
	$SqlAdapter = New-Object System.Data.SqlClient.SqlDataAdapter
	$SqlAdapter.SelectCommand = $SqlCmd
	$dataSet = New-Object System.Data.DataSet
     Try {		
	     #Output the lines to a CSV file
		$nRecs = $SqlAdapter.Fill($dataSet)
		$global:EmpCnt = $nRecs
          ($dataSet.Tables[0] | select $dataSet.Tables[0].Columns.ColumnName ) | ConvertTo-Json | Out-File $oFile
          $nRecs | Out-Null
	}
  Catch [System.Exception]
  {
     $ex = $_.Exception
     Write-Host $ex.Message
	$global:ECnt += 1		
  }
}
function OpenDatabase ($s, $d)
{
    #use Server\Instance for named SQL instances!
    $SQLDBName = "GPIntegration"
    $SqlConnection = New-Object System.Data.SqlClient.SqlConnection
    $SqlConnection.ConnectionString = "Server = $s; Database = $d; Integrated Security = True"
    $SqlConnection.Open()
    return $SqlConnection
}
#Main Process
$ElapsedTime = [System.Diagnostics.Stopwatch]::StartNew()
Write-Host "Script Started at $(get-date)"
$global:ECnt = 0
Try {	
		$ver = Version;
		if ($v)
			{ Write-Host "version: $ver"; }
		Write-Host "Server:" $Server "DB:" $Database "Table:" $Table "OutFile:" $OutFile
		Write-Host "Opening connection for database $Database and on SQL instance: $Server" 
		[System.Data.SqlClient.SqlConnection] $SqlConnection = OpenDatabase $Server $Database	
          ExportTable $Table $OutFile
}
Catch [System.Exception]
{
  $ex = $_.Exception
	Write-Output $ex.Message
	$ECnt += 1
}
finally
{
  $SqlConnection.Close()
}
Write-Host "Done"
Write-Host "$ECnt Exception Errors"
Write-Host "Script Ended at $(get-date)"
Write-Host "Total Elapsed Time: $($ElapsedTime.Elapsed.ToString())"