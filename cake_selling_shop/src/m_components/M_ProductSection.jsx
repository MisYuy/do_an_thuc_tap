import React from 'react';

const M_ProductSection = () => {
    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <strong className="card-title">Data Table</strong>
                            </div>
                            <div className="card-body">
                                <table id="bootstrap-data-table" className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Name</th>
                                            <th>Position</th>
                                            <th>Office</th>
                                            <th>Salary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{alignContent: 'center'}}><a href="#"><img className="rounded-circle" src="/img/avatar.jpg" alt="avatar" /></a></td>
                                            <td style={{alignContent: 'center'}}>Tiger Nixon</td>
                                            <td style={{alignContent: 'center'}}>System Architect</td>
                                            <td style={{alignContent: 'center'}}>Edinburgh</td>
                                            <td style={{alignContent: 'center'}}>$320,800</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default M_ProductSection;
